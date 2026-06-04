const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const mockDB = require('../mocks/db');
const ReportGenerator = require('../services/report.service');
const { errorHandler } = require('../utils/errorHandler');

const useMock = process.env.USE_MOCK_DB === 'true';

exports.getAttendanceReport = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Permission check: students can only download their own reports
    if (req.user.role === 'student' && req.user.id !== studentId) {
      const { status, body } = errorHandler.forbidden('You can only access your own reports');
      return res.status(status).json(body);
    }

    const student = useMock
      ? mockDB.findStudentById(studentId)
      : await Student.findById(studentId);

    if (!student) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }

    const attendance = useMock
      ? mockDB.findAttendanceByStudent(studentId)
      : await Attendance.find({ studentId });

    const pdfBuffer = await ReportGenerator.generateAttendanceReport(student, attendance);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="attendance-${studentId}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getPerformanceReport = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Permission check: students can only download their own reports
    if (req.user.role === 'student' && req.user.id !== studentId) {
      const { status, body } = errorHandler.forbidden('You can only access your own reports');
      return res.status(status).json(body);
    }

    const student = useMock
      ? mockDB.findStudentById(studentId)
      : await Student.findById(studentId);

    if (!student) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }

    const marks = useMock
      ? mockDB.findMarksByStudent(studentId)
      : await Marks.find({ studentId });

    const pdfBuffer = await ReportGenerator.generatePerformanceReport(student, marks);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="performance-${studentId}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getReportCard = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Permission check: students can only download their own reports
    if (req.user.role === 'student' && req.user.id !== studentId) {
      const { status, body } = errorHandler.forbidden('You can only access your own reports');
      return res.status(status).json(body);
    }

    const student = useMock
      ? mockDB.findStudentById(studentId)
      : await Student.findById(studentId);

    if (!student) {
      const { status, body } = errorHandler.notFound('Student not found');
      return res.status(status).json(body);
    }

    const marks = useMock
      ? mockDB.findMarksByStudent(studentId)
      : await Marks.find({ studentId });

    const attendance = useMock
      ? mockDB.findAttendanceByStudent(studentId)
      : await Attendance.find({ studentId });

    const pdfBuffer = await ReportGenerator.generateReportCard(student, marks, attendance);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-card-${studentId}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};
