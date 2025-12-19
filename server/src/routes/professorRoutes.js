const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const availabilityController = require('../controllers/availabilityController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/professors:
 *   get:
 *     summary: Get all professors
 *     tags: [Professors]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of professors
 */
router.get('/', professorController.getAllProfessors);

/**
 * @swagger
 * /api/professors/{id}:
 *   get:
 *     summary: Get professor by ID
 *     tags: [Professors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Professor details
 */
router.get('/:id', professorController.getProfessorById);

/**
 * @swagger
 * /api/professors/{professorId}/availability:
 *   get:
 *     summary: Get professor availability slots
 *     tags: [Professors]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available slots
 */
router.get('/:professorId/availability', availabilityController.getProfessorAvailability);

/**
 * @swagger
 * /api/professors/me:
 *   put:
 *     summary: Update my professor profile (subjects, hourlyRate, headline)
 *     tags: [Professors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Professor profile updated successfully
 */
router.put('/me', authenticate, requireRole('PROFESSOR'), professorController.updateMyProfile);

module.exports = router;

