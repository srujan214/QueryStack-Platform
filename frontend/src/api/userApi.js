import api from './axios';

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/me/password', data),
  getUserById: (id) => api.get(`/users/${id}`),
  getUserByUsername: (username) => api.get(`/users/username/${username}`),
  search: (keyword, page = 0, size = 10) => api.get(`/users/search?keyword=${keyword}&page=${page}&size=${size}`),
};