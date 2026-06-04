const NotificationService = require('../services/notification.service');
const { errorHandler } = require('../utils/errorHandler');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, unreadOnly = false } = req.query;

    const notifications = await NotificationService.getNotifications(userId, parseInt(limit), !unreadOnly);
    const { status, body } = errorHandler.success(notifications);
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await NotificationService.getUnreadCount(userId);
    const { status, body } = errorHandler.success({ unreadCount: count });
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      const { status, body } = errorHandler.badRequest('Notification ID is required');
      return res.status(status).json(body);
    }

    const notification = await NotificationService.markAsRead(notificationId);

    if (!notification) {
      const { status, body } = errorHandler.notFound('Notification not found');
      return res.status(status).json(body);
    }

    const { status, body } = errorHandler.success(notification, 'Notification marked as read');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await NotificationService.markAllAsRead(userId);
    const { status, body } = errorHandler.success(null, 'All notifications marked as read');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      const { status, body } = errorHandler.badRequest('Notification ID is required');
      return res.status(status).json(body);
    }

    await NotificationService.deleteNotification(notificationId);
    const { status, body } = errorHandler.success(null, 'Notification deleted successfully');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.registerDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      const { status, body } = errorHandler.badRequest('Device token is required');
      return res.status(status).json(body);
    }

    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      const { status, body } = errorHandler.notFound('User not found');
      return res.status(status).json(body);
    }

    user.pushTokens = user.pushTokens || [];
    if (!user.pushTokens.includes(token)) {
      user.pushTokens.push(token);
      await user.save();
    }

    const { status, body } = errorHandler.success(null, 'Device registered');
    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};
