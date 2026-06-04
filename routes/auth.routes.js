const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

module.exports = router;
