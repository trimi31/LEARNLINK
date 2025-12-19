const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { lessonCreateValidator } = require('../utils/validators');

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update lesson (professor owner)
 *     tags: [Lessons]
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
 *         description: Lesson updated successfully
 */
router.put('/:id', authenticate, requireRole('PROFESSOR'), lessonCreateValidator, validate, lessonController.updateLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete lesson (professor owner)
 *     tags: [Lessons]
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
 *         description: Lesson deleted successfully
 */
router.delete('/:id', authenticate, requireRole('PROFESSOR'), lessonController.deleteLesson);

module.exports = router;

