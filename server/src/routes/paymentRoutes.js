const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { paymentCheckoutValidator } = require('../utils/validators');

/**
 * @swagger
 * /api/payments/checkout:
 *   post:
 *     summary: Process payment (student)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment processed successfully
 */
router.post('/checkout', authenticate, requireRole('STUDENT'), paymentCheckoutValidator, validate, paymentController.checkout);

/**
 * @swagger
 * /api/payments/me:
 *   get:
 *     summary: Get my payments (student)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/me', authenticate, requireRole('STUDENT'), paymentController.getMyPayments);

module.exports = router;

