const Notification = require('../models/Notification');
const mockDB = require('../mocks/db');
const PushService = require('./push.service');
const User = require('../models/User');

const useMock = process.env.USE_MOCK_DB === 'true';

class NotificationService {
  static async createNotification(userId, title, message, type = 'system', relatedStudentId = null) {
    try {
      if (useMock) {
        const notification = {
          _id: `notif-${Date.now()}`,
          userId,
          title,
          message,
          type,
          relatedStudentId,
          read: false,
          createdAt: new Date(),
        };
        if (!mockDB.notifications) {
          mockDB.notifications = [];
        }
        mockDB.notifications.push(notification);
        // attempt push for mock users stored with pushTokens
        try {
          await PushService.sendToUser(userId, title, message, { type, relatedStudentId });
        } catch (pe) {
          console.error('Mock push send failed:', pe);
        }
        return notification;
      }

      const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        relatedStudentId,
        read: false,
      });

      // send push notifications if user has tokens
      try {
        await PushService.sendToUser(userId, title, message, { type, relatedStudentId });
      } catch (pe) {
        console.error('Push send failed:', pe);
      }

      return notification;
    } catch (err) {
      console.error('Error creating notification:', err);
      throw err;
    }
  }

  static async getNotifications(userId, limit = 20, includeRead = true) {
    try {
      if (useMock) {
        let notifications = (mockDB.notifications || []).filter((n) => n.userId === userId);
        if (!includeRead) {
          notifications = notifications.filter((n) => !n.read);
        }
        return notifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
      }

      const query = { userId };
      if (!includeRead) {
        query.read = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('relatedStudentId', 'fullName class');

      return notifications;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      throw err;
    }
  }

  static async getUnreadCount(userId) {
    try {
      if (useMock) {
        const unreadCount = (mockDB.notifications || []).filter((n) => n.userId === userId && !n.read).length;
        return unreadCount;
      }

      const count = await Notification.countDocuments({ userId, read: false });
      return count;
    } catch (err) {
      console.error('Error fetching unread count:', err);
      throw err;
    }
  }

  static async markAsRead(notificationId) {
    try {
      if (useMock) {
        const notification = (mockDB.notifications || []).find((n) => n._id === notificationId);
        if (notification) {
          notification.read = true;
        }
        return notification;
      }

      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );

      return notification;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }

  static async markAllAsRead(userId) {
    try {
      if (useMock) {
        (mockDB.notifications || [])
          .filter((n) => n.userId === userId && !n.read)
          .forEach((n) => {
            n.read = true;
          });
        return { modifiedCount: (mockDB.notifications || []).filter((n) => n.userId === userId && n.read).length };
      }

      const result = await Notification.updateMany({ userId, read: false }, { read: true });
      return result;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  }

  static async deleteNotification(notificationId) {
    try {
      if (useMock) {
        const index = (mockDB.notifications || []).findIndex((n) => n._id === notificationId);
        if (index > -1) {
          mockDB.notifications.splice(index, 1);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      }

      const result = await Notification.deleteOne({ _id: notificationId });
      return result;
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  }

  static async notifyAttendanceMarked(studentId, studentName, teachers) {
    try {
      const title = 'Attendance Recorded';
      const message = `Attendance marked for ${studentName}`;

      for (const teacherId of teachers) {
        await this.createNotification(teacherId, title, message, 'attendance', studentId);
      }
    } catch (err) {
      console.error('Error notifying attendance:', err);
    }
  }

  static async notifyMarksRecorded(studentId, studentName, subject, score, teachers) {
    try {
      const title = 'Marks Recorded';
      const message = `${studentName} scored ${score} in ${subject}`;

      for (const teacherId of teachers) {
        await this.createNotification(teacherId, title, message, 'marks', studentId);
      }
    } catch (err) {
      console.error('Error notifying marks:', err);
    }
  }

  static async notifyLowAttendance(studentId, studentName, attendancePercent, parents) {
    try {
      if (attendancePercent < 75) {
        const title = 'Low Attendance Alert';
        const message = `${studentName}'s attendance is ${attendancePercent}%. Please ensure regular attendance.`;

        for (const parentId of parents) {
          await this.createNotification(parentId, title, message, 'alert', studentId);
        }
      }
    } catch (err) {
      console.error('Error notifying low attendance:', err);
    }
  }
}

module.exports = NotificationService;
