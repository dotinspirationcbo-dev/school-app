const router = require('express').Router();
const { auth, roleCheck } = require('../middleware/auth.middleware');
const reportController = require('../controllers/report.controller');

// All report endpoints require authentication
router.use(auth);

// Students can download their own reports, teachers and admins can download any student's reports
router.get('/attendance/:studentId', reportController.getAttendanceReport);
router.get('/performance/:studentId', reportController.getPerformanceReport);
router.get('/report-card/:studentId', reportController.getReportCard);

module.exports = router;
