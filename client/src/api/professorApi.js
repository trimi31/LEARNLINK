import axios from './axios';

export const professorApi = {
  getAll: (params) => axios.get('/professors', { params }),
  getById: (id) => axios.get(`/professors/${id}`),
  getAvailability: (professorId) => axios.get(`/professors/${professorId}/availability`),
  updateMyProfile: (data) => axios.put('/professors/me', data),
};

