import axios from './axios';

export const profileApi = {
  getMyProfile: () => axios.get('/profiles/me'),
  updateMyProfile: (data) => axios.put('/profiles/me', data),
};

