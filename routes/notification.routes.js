const router = require('express').Router();
const { auth } = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

// All notification endpoints require authentication
router.use(auth);

// Get notifications for current user
router.get('/', notificationController.getNotifications);

// Get unread notification count
router.get('/unread-count', notificationController.getUnreadCount);

// Register device token for push notifications
router.post('/register-device', notificationController.registerDevice);

// Mark single notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
