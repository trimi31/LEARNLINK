const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { availabilityCreateValidator } = require('../utils/validators');

/**
 * @swagger
 * /api/availability/me:
 *   get:
 *     summary: Get my availability slots (professor)
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of availability slots
 */
router.get('/me', authenticate, requireRole('PROFESSOR'), availabilityController.getMyAvailability);

/**
 * @swagger
 * /api/availability/professor/{professorId}:
 *   get:
 *     summary: Get availability slots by professor
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of availability slots
 */
router.get('/professor/:professorId', availabilityController.getProfessorAvailability);

/**
 * @swagger
 * /api/availability/{id}:
 *   get:
 *     summary: Get availability slot by ID
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability slot details
 */
router.get('/:id', availabilityController.getById);

/**
 * @swagger
 * /api/availability:
 *   post:
 *     summary: Create availability slot (professor)
 *     tags: [Availability]
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
 *         description: Availability created successfully
 */
router.post('/', authenticate, requireRole('PROFESSOR'), availabilityCreateValidator, validate, availabilityController.createAvailability);

/**
 * @swagger
 * /api/availability/{id}:
 *   delete:
 *     summary: Delete availability slot (professor)
 *     tags: [Availability]
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
 *         description: Availability deleted successfully
 */
router.delete('/:id', authenticate, requireRole('PROFESSOR'), availabilityController.deleteAvailability);

module.exports = router;

