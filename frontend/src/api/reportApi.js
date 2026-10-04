import api from './axios';

export const reportApi = {
  create: (data) => api.post('/reports', data),
};