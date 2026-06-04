import api from './api';

export const getNotifications = async (params = {}) => {
  const res = await api.get('/api/notifications', { params });
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get('/api/notifications/unread-count');
  return res.data;
};

export const markAsRead = async (notificationId) => {
  const res = await api.put(`/api/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllRead = async () => {
  const res = await api.put('/api/notifications/read-all');
  return res.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await api.delete(`/api/notifications/${notificationId}`);
  return res.data;
};
