const { Expo } = require('expo-server-sdk');
const User = require('../models/User');

const expo = new Expo();

class PushService {
  static async sendToTokens(tokens, title, message, data = {}) {
    try {
      if (!tokens || tokens.length === 0) return;

      const messages = [];
      for (const pushToken of tokens) {
        if (!Expo.isExpoPushToken(pushToken)) continue;
        messages.push({
          to: pushToken,
          sound: 'default',
          title,
          body: message,
          data,
        });
      }

      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          const receipts = await expo.sendPushNotificationsAsync(chunk);
          // receipts correspond to messages in this chunk
          for (let i = 0; i < receipts.length; i++) {
            const receipt = receipts[i];
            const pushedMessage = chunk[i];
            if (receipt.status === 'error') {
              const error = receipt.message || (receipt.details && receipt.details.error) || 'unknown_error';
              console.warn('Push receipt error for token', pushedMessage.to, error);

              // If device is not registered / invalid, remove token from any users
              if (error === 'DeviceNotRegistered' || error === 'NotRegistered' || (receipt.details && receipt.details.error === 'DeviceNotRegistered')) {
                try {
                  const users = await User.find({ pushTokens: pushedMessage.to });
                  for (const u of users) {
                    u.pushTokens = (u.pushTokens || []).filter((t) => t !== pushedMessage.to);
                    await u.save();
                    console.log('Removed invalid push token from user', u._id.toString());
                  }
                } catch (remErr) {
                  console.error('Failed to remove invalid push token', remErr);
                }
              }
            }
          }
        } catch (err) {
          console.error('Error sending push chunk', err);
        }
      }
    } catch (err) {
      console.error('Push send error', err);
    }
  }

  static async sendToUser(userId, title, message, data = {}) {
    try {
      const user = await User.findById(userId).select('pushTokens');
      if (!user || !user.pushTokens || user.pushTokens.length === 0) return;
      await this.sendToTokens(user.pushTokens, title, message, data);
    } catch (err) {
      console.error('sendToUser error', err);
    }
  }
}

module.exports = PushService;
