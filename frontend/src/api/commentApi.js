import api from './axios';

export const commentApi = {
  create: (data) => api.post('/comments', data),
  getByPost: (postId) => api.get(`/comments/post/${postId}`),
  update: (id, content) => api.put(`/comments/${id}?content=${encodeURIComponent(content)}`),
  delete: (id) => api.delete(`/comments/${id}`),
};