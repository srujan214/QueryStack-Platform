import api from './axios';

export const notificationApi = {
  getAll: (page = 0, size = 20) => api.get(`/notifications?page=${page}&size=${size}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAllRead: () => api.put('/notifications/read-all'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications/clear'),
};