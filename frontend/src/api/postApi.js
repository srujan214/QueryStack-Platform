import api from './axios';

export const postApi = {
  create: (data) => api.post('/posts', data),
  getById: (id) => api.get(`/posts/${id}`),
  getRecent: (page = 0, size = 10) => api.get(`/posts/recent?page=${page}&size=${size}`),
  getTrending: (page = 0, size = 10) => api.get(`/posts/trending?page=${page}&size=${size}`),
  getByCommunity: (id, page = 0, size = 10) => api.get(`/posts/community/${id}?page=${page}&size=${size}`),
  getByAuthor: (username, page = 0, size = 10) => api.get(`/posts/author/${username}?page=${page}&size=${size}`),
  search: (keyword, page = 0, size = 10) => api.get(`/posts/search?keyword=${keyword}&page=${page}&size=${size}`),
  getByTag: (tag, page = 0, size = 10) => api.get(`/posts/tag/${tag}?page=${page}&size=${size}`),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};