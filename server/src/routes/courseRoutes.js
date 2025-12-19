const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const lessonController = require('../controllers/lessonController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { courseCreateValidator, courseUpdateValidator, lessonCreateValidator } = require('../utils/validators');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all published courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/my:
 *   get:
 *     summary: Get my courses (professor)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my courses
 */
router.get('/my', authenticate, requireRole('PROFESSOR'), courseController.getMyCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course (professor only)
 *     tags: [Courses]
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
 *         description: Course created successfully
 */
router.post('/', authenticate, requireRole('PROFESSOR'), courseCreateValidator, validate, courseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update course (professor owner)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
router.put('/:id', authenticate, requireRole('PROFESSOR'), courseUpdateValidator, validate, courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course (professor owner)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 */
router.delete('/:id', authenticate, requireRole('PROFESSOR'), courseController.deleteCourse);

/**
 * @swagger
 * /api/courses/{courseId}/lessons:
 *   post:
 *     summary: Add lesson to course (professor owner)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Lesson created successfully
 */
router.post('/:courseId/lessons', authenticate, requireRole('PROFESSOR'), lessonCreateValidator, validate, lessonController.createLesson);

module.exports = router;

