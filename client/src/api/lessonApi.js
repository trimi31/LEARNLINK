import axios from './axios';

export const lessonApi = {
  update: (id, data) => axios.put(`/lessons/${id}`, data),
  delete: (id) => axios.delete(`/lessons/${id}`),
};

