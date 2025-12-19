import axios from './axios';

export const paymentApi = {
  checkout: (data) => axios.post('/payments/checkout', data),
  getMyPayments: () => axios.get('/payments/me'),
};

