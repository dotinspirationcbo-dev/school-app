const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const mockDB = require('../mocks/db');
const { errorHandler } = require('../utils/errorHandler');
const {
  calculateAttendancePercentage,
  calculateAverageMarks,
  calculateSystemStats,
  calculateAttendanceTrends,
  calculatePerformanceSummary,
  calculateGrowthMetrics,
  calculateClassLevelInsights
} = require('../services/dashboard.service');

const useMock = process.env.USE_MOCK_DB === 'true';

// Teacher Dashboard
exports.getTeacherDashboard = async (req, res) => {
  try {
    if (useMock) {
      const students = mockDB.findStudents();
      const attendance = mockDB.findAllAttendance();
      const marks = mockDB.findMarks();

      const trends = calculateAttendanceTrends(attendance);
      const performance = calculatePerformanceSummary(marks);
      const growth = calculateGrowthMetrics(attendance, marks);
      const classInsights = calculateClassLevelInsights(students, attendance, marks);

      return res.json({
        assignedStudents: students.length,
        classesOverview: {
          totalClasses: students.length > 0 ? Math.ceil(students.length / 30) : 0,
          averageClassSize: students.length > 0 ? Math.round(students.length / Math.max(1, Math.ceil(students.length / 30))) : 0,
          classInsights
        },
        attendanceStats: {
          averageAttendance: calculateAttendancePercentage(attendance),
          totalRecords: attendance.length,
          presentCount: attendance.filter((a) => a.status === 'present').length,
          absentCount: attendance.filter((a) => a.status === 'absent').length,
          trends
        },
        marksEntrySummary: {
          totalEntriesRecorded: marks.length,
          subjects: [...new Set(marks.map((m) => m.subject))],
          averageScore: calculateAverageMarks(marks),
          performance
        },
        growthMetrics: growth
      });
    }

    const students = await Student.find();
    const attendance = await Attendance.find();
    const marks = await Marks.find();

    const trends = calculateAttendanceTrends(attendance);
    const performance = calculatePerformanceSummary(marks);
    const growth = calculateGrowthMetrics(attendance, marks);
    const classInsights = calculateClassLevelInsights(students, attendance, marks);

    res.json({
      assignedStudents: students.length,
      classesOverview: {
        totalClasses: students.length > 0 ? Math.ceil(students.length / 30) : 0,
        averageClassSize: students.length > 0 ? Math.round(students.length / Math.max(1, Math.ceil(students.length / 30))) : 0,
        classInsights
      },
      attendanceStats: {
        averageAttendance: calculateAttendancePercentage(attendance),
        totalRecords: attendance.length,
        presentCount: attendance.filter((a) => a.status === 'present').length,
        absentCount: attendance.filter((a) => a.status === 'absent').length,
        trends
      },
      marksEntrySummary: {
        totalEntriesRecorded: marks.length,
        subjects: [...new Set(marks.map((m) => m.subject))],
        averageScore: calculateAverageMarks(marks),
        performance
      },
      growthMetrics: growth
    });
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

// Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    if (useMock) {
      const students = mockDB.findStudents();
      const users = mockDB.users;
      const attendance = mockDB.findAllAttendance();
      const marks = mockDB.findMarks();

      const teachers = users.filter((u) => u.role === 'teacher');
      const stats = calculateSystemStats(students, teachers, attendance);

      const trends = calculateAttendanceTrends(attendance);
      const performance = calculatePerformanceSummary(marks);
      const growth = calculateGrowthMetrics(attendance, marks);
      const classInsights = calculateClassLevelInsights(students, attendance, marks);

      return res.json({
        systemOverview: stats,
        totalStudents: stats.totalStudents,
        totalTeachers: stats.totalTeachers,
        attendanceRates: {
          average: stats.averageAttendance,
          total: stats.totalAttendanceRecords,
          trends
        },
        userStats: {
          students: stats.totalStudents,
          teachers: stats.totalTeachers,
          admins: users.filter((u) => u.role === 'admin').length
        },
        analyticsOverview: {
          performance,
          growth,
          classInsights
        }
      });
    }

    const students = await Student.find();
    const users = await User.find();
    const attendance = await Attendance.find();
    const marks = await Marks.find();

    const teachers = users.filter((u) => u.role === 'teacher');
    const stats = calculateSystemStats(students, teachers, attendance);

    const trends = calculateAttendanceTrends(attendance);
    const performance = calculatePerformanceSummary(marks);
    const growth = calculateGrowthMetrics(attendance, marks);
    const classInsights = calculateClassLevelInsights(students, attendance, marks);

    res.json({
      systemOverview: stats,
      totalStudents: stats.totalStudents,
      totalTeachers: stats.totalTeachers,
      attendanceRates: {
        average: stats.averageAttendance,
        total: stats.totalAttendanceRecords,
        trends
      },
      userStats: {
        students: stats.totalStudents,
        teachers: stats.totalTeachers,
        admins: users.filter((u) => u.role === 'admin').length
      },
      analyticsOverview: {
        performance,
        growth,
        classInsights
      }
    });
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

// Student Dashboard
exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    if (useMock) {
      const student = mockDB.findStudentById(studentId);
      const marks = mockDB.findMarksByStudent(studentId);
      const attendance = mockDB.findAttendanceByStudent(studentId);

      const performance = calculatePerformanceSummary(marks);

      return res.json({
        profile: student || { id: studentId, message: 'No profile found' },
        attendanceSummary: {
          percentage: calculateAttendancePercentage(attendance),
          total: attendance.length,
          present: attendance.filter((a) => a.status === 'present').length,
          absent: attendance.filter((a) => a.status === 'absent').length
        },
        marksSummary: {
          averageScore: calculateAverageMarks(marks),
          totalMarks: marks.length,
          subjects: [...new Set(marks.map((m) => m.subject))].length,
          performance
        },
        recentActivity: {
          latestMarks: marks.slice(-3).reverse(),
          latestAttendance: attendance.slice(-5).reverse()
        }
      });
    }

    const student = await Student.findById(studentId);
    const marks = await Marks.find({ studentId });
    const attendance = await Attendance.find({ studentId });

    const performance = calculatePerformanceSummary(marks);

    res.json({
      profile: student || { id: studentId, message: 'No profile found' },
      attendanceSummary: {
        percentage: calculateAttendancePercentage(attendance),
        total: attendance.length,
        present: attendance.filter((a) => a.status === 'present').length,
        absent: attendance.filter((a) => a.status === 'absent').length
      },
      marksSummary: {
        averageScore: calculateAverageMarks(marks),
        totalMarks: marks.length,
        subjects: [...new Set(marks.map((m) => m.subject))].length,
        performance
      },
      recentActivity: {
        latestMarks: marks.slice(-3).reverse(),
        latestAttendance: attendance.slice(-5).reverse()
      }
    });
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    if (useMock) {
      const students = mockDB.findStudents();
      const attendance = mockDB.findAttendanceByDate(today);
      const presentCount = attendance.filter((a) => a.status === 'present').length;
      const absentCount = attendance.filter((a) => a.status === 'absent').length;
      const attendanceToday = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

      return res.json({
        totalStudents: students.length,
        attendanceToday,
        presentCount,
        absentCount,
      });
    }

    const students = await Student.find();
    const attendance = await Attendance.find({ date: today });
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const absentCount = attendance.filter((a) => a.status === 'absent').length;
    const attendanceToday = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

    res.json({
      totalStudents: students.length,
      attendanceToday,
      presentCount,
      absentCount,
    });
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};
