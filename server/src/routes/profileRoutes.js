const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { profileUpdateValidator } = require('../utils/validators');

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/me', authenticate, profileController.getMyProfile);

/**
 * @swagger
 * /api/profiles/me:
 *   put:
 *     summary: Update my profile
 *     tags: [Profiles]
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
 *         description: Profile updated successfully
 */
router.put('/me', authenticate, profileUpdateValidator, validate, profileController.updateMyProfile);

module.exports = router;

