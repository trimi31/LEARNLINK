import axios from './axios';

export const bookingApi = {
  create: (data) => axios.post('/bookings', data),
  getMyBookings: () => axios.get('/bookings/me'),
  getProfessorBookings: () => axios.get('/bookings/professor'),
  cancel: (id) => axios.patch(`/bookings/${id}/cancel`),
  confirm: (id) => axios.patch(`/bookings/${id}/confirm`),
  complete: (id) => axios.patch(`/bookings/${id}/complete`),
};

