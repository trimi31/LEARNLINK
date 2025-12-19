import axios from './axios';

export const reviewApi = {
  create: (data) => axios.post('/reviews', data),
  getCourseReviews: (courseId) => axios.get(`/reviews/course/${courseId}`),
  getProfessorReviews: (professorId) => axios.get(`/reviews/professor/${professorId}`),
};

