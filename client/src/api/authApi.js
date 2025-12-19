import axios from './axios';

export const authApi = {
  register: (data) => axios.post('/auth/register', data),
  login: (data) => axios.post('/auth/login', data),
  me: () => axios.get('/auth/me'),
  getMe: () => axios.get('/auth/me'),
};

