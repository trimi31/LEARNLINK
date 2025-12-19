const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { bookingCreateValidator } = require('../utils/validators');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking (student)
 *     tags: [Bookings]
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
 *         description: Booking created successfully
 */
router.post('/', authenticate, requireRole('STUDENT'), bookingCreateValidator, validate, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     summary: Get my bookings (student)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/me', authenticate, requireRole('STUDENT'), bookingController.getMyBookings);

/**
 * @swagger
 * /api/bookings/professor:
 *   get:
 *     summary: Get bookings for professor
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/professor', authenticate, requireRole('PROFESSOR'), bookingController.getProfessorBookings);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
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
 *         description: Booking canceled successfully
 */
router.patch('/:id/cancel', authenticate, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/confirm:
 *   patch:
 *     summary: Confirm a pending booking (professor only)
 *     tags: [Bookings]
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
 *         description: Booking confirmed successfully
 */
router.patch('/:id/confirm', authenticate, requireRole('PROFESSOR'), bookingController.confirmBooking);

/**
 * @swagger
 * /api/bookings/{id}/complete:
 *   patch:
 *     summary: Mark a booking as completed (professor only)
 *     tags: [Bookings]
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
 *         description: Booking completed successfully
 */
router.patch('/:id/complete', authenticate, requireRole('PROFESSOR'), bookingController.completeBooking);

module.exports = router;

