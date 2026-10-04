import api from './axios';

export const bookmarkApi = {
  save: (postId) => api.post(`/bookmarks/${postId}`),
  remove: (postId) => api.delete(`/bookmarks/${postId}`),
  getAll: (page = 0, size = 10) => api.get(`/bookmarks?page=${page}&size=${size}`),
  check: (postId) => api.get(`/bookmarks/check/${postId}`),
};