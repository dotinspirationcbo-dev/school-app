const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const mockDB = require('../mocks/db');
const { errorHandler } = require('../utils/errorHandler');
const User = require('../models/User');
const NotificationService = require('../services/notification.service');
const { normalizePhone } = require('../utils/phone');

const useMock = process.env.USE_MOCK_DB === 'true';

exports.createStudent = async (req, res) => {
  try {
    const payload = {
      fullName: req.body.fullName,
      class: req.body.class,
      age: req.body.age,
      parentContact: req.body.parentContact,
    };

    if (!payload.fullName || !payload.class || !payload.age || !payload.parentContact) {
      const { status, body } = errorHandler.badRequest('fullName, class, age, and parentContact are required');
      return res.status(status).json(body);
    }

    const student = useMock
      ? mockDB.createStudent(payload)
      : await Student.create(payload);

    const { status, body } = errorHandler.created(student, 'Student created successfully');
    res.status(status).json(body);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors || {}).map((e) => e.message);
      const { status, body } = errorHandler.validationError(errors);
      return res.status(status).json(body);
    }
    if (err.code === 11000) {
      const { status, body } = errorHandler.conflict('Student with this information already exists');
      return res.status(status).json(body);
    }
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = useMock
      ? mockDB.updateStudent(req.params.id, req.body)
      : await Student.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
          context: 'query',
        });

    if (!student) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }
    const { status, body } = errorHandler.success(student, 'Student updated successfully');
    res.status(status).json(body);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors || {}).map((e) => e.message);
      const { status, body } = errorHandler.validationError(errors);
      return res.status(status).json(body);
    }
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deleted = useMock
      ? mockDB.deleteStudent(req.params.id)
      : await Student.findByIdAndDelete(req.params.id);

    if (!deleted && !useMock) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }
    const { status, body } = errorHandler.success(null, 'Student deleted successfully');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getStudentById = async (req, res) => {
  try {
    // Permission check: students can only view their own data
    if (req.user.role === 'student' && req.user.id !== req.params.id) {
      const { status, body } = errorHandler.forbidden('You can only view your own profile');
      return res.status(status).json(body);
    }

    const student = useMock
      ? mockDB.findStudentById(req.params.id)
      : await Student.findById(req.params.id);

    if (!student) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }
    const { status, body } = errorHandler.success(student);
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = useMock
      ? mockDB.findStudents()
      : await Student.find();
    const { status, body } = errorHandler.success(students);
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const attendanceDate = req.body.date || new Date().toISOString().split('T')[0];
    const payload = {
      studentId: req.body.studentId,
      date: attendanceDate,
      status: req.body.status,
      markedBy: req.body.markedBy,
    };

    if (!payload.studentId || !payload.status) {
      const { status, body } = errorHandler.badRequest('studentId and status are required');
      return res.status(status).json(body);
    }

    if (!['present', 'absent'].includes(payload.status)) {
      const { status, body } = errorHandler.badRequest('status must be either "present" or "absent"');
      return res.status(status).json(body);
    }

    // Check if student exists
    const student = useMock
      ? mockDB.findStudentById(payload.studentId)
      : await Student.findById(payload.studentId);

    if (!student) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }

    if (useMock) {
      const existing = mockDB.attendanceRecords.find((record) => record.studentId === payload.studentId && record.date === payload.date);
      if (existing) {
        const { status, body } = errorHandler.conflict('Attendance already marked for this student on this date');
        return res.status(status).json(body);
      }
      const attendance = mockDB.createAttendance(payload);

      // Notify teachers in mock DB
      const teachers = (mockDB.users || []).filter((u) => u.role === 'teacher').map((t) => t._id || t.id);
      try {
        await NotificationService.notifyAttendanceMarked(payload.studentId, (student && student.fullName) || 'Student', teachers);
      } catch (nerr) {
        console.error('Notification error (mock):', nerr);
      }

      const { status, resp } = errorHandler.created(attendance, 'Attendance recorded successfully');
      return res.status(status).json(resp);
    }

    const attendance = await Attendance.create(payload);

    // Notify teachers
    try {
      const teachers = await User.find({ role: 'teacher' }).select('_id');
      const teacherIds = teachers.map((t) => t._id.toString());
      await NotificationService.notifyAttendanceMarked(payload.studentId, student.fullName, teacherIds);

      // Compute attendance percent for this student and notify parents if low
      const allRecords = await Attendance.find({ studentId: payload.studentId });
      const presentCount = allRecords.filter((r) => r.status === 'present').length;
      const total = allRecords.length;
      const attendancePercent = total > 0 ? Math.round((presentCount / total) * 100) : 0;

      if (student.parentContact) {
        const norm = normalizePhone(student.parentContact);
        const parents = await User.find({ role: 'parent', phone: norm }).select('_id');
        const parentIds = parents.map((p) => p._id.toString());
        if (parentIds.length > 0) {
          await NotificationService.notifyLowAttendance(payload.studentId, student.fullName, attendancePercent, parentIds);
        }
      }
    } catch (nerr) {
      console.error('Notification error:', nerr);
    }

    const { status, body } = errorHandler.created(attendance, 'Attendance recorded successfully');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    if (!req.body.status || !['present', 'absent'].includes(req.body.status)) {
      const { status, body } = errorHandler.badRequest('status must be either "present" or "absent"');
      return res.status(status).json(body);
    }

    const attendance = useMock
      ? mockDB.updateAttendance(req.params.id, req.body)
      : await Attendance.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
          context: 'query',
        });

    if (!attendance) {
      const { status, body } = errorHandler.notFound('Attendance record not found');
      return res.status(status).json(body);
    }
    const { status, body } = errorHandler.success(attendance, 'Attendance updated successfully');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const attendance = useMock
      ? mockDB.findAttendanceByDate(date)
      : await Attendance.find(date ? { date } : {});
    const { status, body } = errorHandler.success(attendance);
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.createMarks = async (req, res) => {
  try {
    if (!req.body.studentId || !req.body.subject || !req.body.score) {
      const { status, body } = errorHandler.badRequest('studentId, subject, and score are required');
      return res.status(status).json(body);
    }

    const student = useMock
      ? mockDB.findStudentById(req.body.studentId)
      : await Student.findById(req.body.studentId);

    if (!student) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }

    const marks = useMock
      ? mockDB.createMarks(req.body)
      : await Marks.create(req.body);

    try {
      const teachers = useMock
        ? (mockDB.users || []).filter((u) => u.role === 'teacher').map((t) => t._id || t.id)
        : await User.find({ role: 'teacher' }).select('_id');

      const teacherIds = useMock ? teachers : teachers.map((t) => t._id.toString());
      const studentName = student.fullName || 'Student';
      const subject = req.body.subject;
      const score = req.body.score;

      await NotificationService.notifyMarksRecorded(req.body.studentId, studentName, subject, score, teacherIds);
    } catch (nerr) {
      console.error('Notification error (marks):', nerr);
    }

    const { status, body } = errorHandler.created(marks, 'Marks recorded successfully');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getMarks = async (req, res) => {
  try {
    const marks = useMock
      ? mockDB.findMarks()
      : await Marks.find().populate('studentId');
    const { status, body } = errorHandler.success(marks);
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const marks = useMock
      ? mockDB.findMarksByStudent(studentId)
      : await Marks.find({ studentId });
    const attendance = useMock
      ? mockDB.findAttendanceByStudent(studentId)
      : await Attendance.find({ studentId });
    const { status, body } = errorHandler.success({ studentId, marks, attendance });
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getProtectedStudents = async (req, res) => {
  try {
    const students = useMock
      ? mockDB.findStudents()
      : await Student.find();
    const { status, body } = errorHandler.success(students, 'Access granted');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getTeacherDashboard = async (req, res) => {
  try {
    const students = useMock
      ? mockDB.findStudents()
      : await Student.find();
    const attendance = useMock
      ? mockDB.findAllAttendance()
      : await Attendance.find().populate('studentId');
    const marks = useMock
      ? mockDB.findMarks()
      : await Marks.find().populate('studentId');
    const { status, body } = errorHandler.success({ students, attendance, marks });
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};
