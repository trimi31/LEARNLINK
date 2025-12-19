const ReviewRepository = require('../repositories/ReviewRepository');
const PaymentRepository = require('../repositories/PaymentRepository');
const StudentRepository = require('../repositories/StudentRepository');

class ReviewService {
  async createReview(userId, data) {
    const student = await StudentRepository.findByUserId(userId);
    if (!student) {
      throw new Error('Only students can create reviews');
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if review already exists
    if (data.courseId) {
      const existing = await ReviewRepository.checkExistingReview(
        student.id,
        data.courseId
      );
      if (existing) {
        throw new Error('You have already reviewed this course');
      }

      // Verify student has paid for this course
      const payment = await PaymentRepository.findPaidPayment(
        student.id,
        null,
        data.courseId
      );
      if (!payment) {
        throw new Error('You must purchase the course before reviewing');
      }
    }

    // Create review
    return await ReviewRepository.create({
      studentId: student.id,
      professorId: data.professorId || null,
      courseId: data.courseId || null,
      rating: data.rating,
      comment: data.comment || null,
    });
  }

  async getCourseReviews(courseId) {
    return await ReviewRepository.findByCourseId(courseId);
  }

  async getProfessorReviews(professorId) {
    return await ReviewRepository.findByProfessorId(professorId);
  }
}

module.exports = new ReviewService();

