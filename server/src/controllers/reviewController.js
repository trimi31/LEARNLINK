const ReviewService = require('../services/ReviewService');

class ReviewController {
  async createReview(req, res, next) {
    try {
      const review = await ReviewService.createReview(req.userId, req.body);
      res.status(201).json({
        message: 'Review created successfully',
        review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseReviews(req, res, next) {
    try {
      const reviews = await ReviewService.getCourseReviews(req.params.courseId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getProfessorReviews(req, res, next) {
    try {
      const reviews = await ReviewService.getProfessorReviews(req.params.professorId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();

