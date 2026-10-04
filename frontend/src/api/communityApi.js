import api from './axios';

export const communityApi = {
  create: (data) => api.post('/communities', data),
  getAll: (page = 0, size = 10) => api.get(`/communities?page=${page}&size=${size}`),
  getById: (id) => api.get(`/communities/${id}`),
  getByName: (name) => api.get(`/communities/name/${name}`),
  search: (keyword, page = 0, size = 10) => api.get(`/communities/search?keyword=${keyword}&page=${page}&size=${size}`),
  join: (id) => api.post(`/communities/${id}/join`),
  leave: (id) => api.post(`/communities/${id}/leave`),
  getMine: () => api.get('/communities/my'),
  delete: (id) => api.delete(`/communities/${id}`),
};