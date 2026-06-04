const router = require('express').Router();
const { auth, roleCheck } = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

router.use(auth);

router.get('/student/dashboard', roleCheck('student'), dashboardController.getStudentDashboard);
router.get('/teacher/dashboard', roleCheck('teacher', 'admin'), dashboardController.getTeacherDashboard);
router.get('/admin/dashboard', roleCheck('admin'), dashboardController.getAdminDashboard);
router.get('/dashboard/stats', dashboardController.getDashboardStats);

module.exports = router;
