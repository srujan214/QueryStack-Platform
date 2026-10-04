import api from './axios';

export const tagApi = {
  getPopular: (page = 0, size = 20) => api.get(`/tags/popular?page=${page}&size=${size}`),
  search: (keyword) => api.get(`/tags/search?keyword=${keyword}`),
  getByName: (name) => api.get(`/tags/${name}`),
};