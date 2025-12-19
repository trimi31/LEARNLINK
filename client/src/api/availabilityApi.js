import axios from './axios';

export const availabilityApi = {
  getMyAvailability: () => axios.get('/availability/me'),
  getById: (id) => axios.get(`/availability/${id}`),
  getByProfessor: (professorId) => axios.get(`/availability/professor/${professorId}`),
  create: (data) => axios.post('/availability', data),
  delete: (id) => axios.delete(`/availability/${id}`),
};
