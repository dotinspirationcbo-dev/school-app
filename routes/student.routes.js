const router = require('express').Router();
const { auth, roleCheck } = require('../middleware/auth.middleware');
const studentController = require('../controllers/student.controller');

router.use(auth);

router.post('/students', roleCheck('admin', 'teacher'), studentController.createStudent);
router.put('/students/:id', roleCheck('admin', 'teacher'), studentController.updateStudent);
router.delete('/students/:id', roleCheck('admin'), studentController.deleteStudent);
router.get('/students/:id', roleCheck('admin', 'teacher', 'student', 'parent'), studentController.getStudentById);
router.get('/students', roleCheck('admin', 'teacher'), studentController.getAllStudents);

router.get('/attendance', roleCheck('admin', 'teacher'), studentController.getAttendanceByDate);
router.post('/attendance', roleCheck('admin', 'teacher'), studentController.createAttendance);
router.put('/attendance/:id', roleCheck('admin', 'teacher'), studentController.updateAttendance);
router.post('/marks', roleCheck('admin', 'teacher'), studentController.createMarks);
router.get('/marks', studentController.getMarks);

router.get('/protected-students', roleCheck('admin', 'teacher'), studentController.getProtectedStudents);

module.exports = router;
