const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { reviewCreateValidator } = require('../utils/validators');

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review (student)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post('/', authenticate, requireRole('STUDENT'), reviewCreateValidator, validate, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/course/{courseId}:
 *   get:
 *     summary: Get reviews for a course
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/course/:courseId', reviewController.getCourseReviews);

/**
 * @swagger
 * /api/reviews/professor/{professorId}:
 *   get:
 *     summary: Get reviews for a professor
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/professor/:professorId', reviewController.getProfessorReviews);

module.exports = router;

