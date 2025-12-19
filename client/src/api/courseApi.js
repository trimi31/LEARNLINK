import axios from './axios';

export const courseApi = {
  getAll: (params) => axios.get('/courses', { params }),
  getById: (id) => axios.get(`/courses/${id}`),
  getMyCourses: () => axios.get('/courses/my'),
  create: (data) => axios.post('/courses', data),
  update: (id, data) => axios.put(`/courses/${id}`, data),
  delete: (id) => axios.delete(`/courses/${id}`),
  addLesson: (courseId, data) => axios.post(`/courses/${courseId}/lessons`, data),
};

