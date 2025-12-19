const LessonService = require('../services/LessonService');

class LessonController {
  async createLesson(req, res, next) {
    try {
      const lesson = await LessonService.createLesson(
        req.userId,
        req.params.courseId,
        req.body
      );
      res.status(201).json({
        message: 'Lesson created successfully',
        lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLesson(req, res, next) {
    try {
      const lesson = await LessonService.updateLesson(
        req.userId,
        req.params.id,
        req.body
      );
      res.json({
        message: 'Lesson updated successfully',
        lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLesson(req, res, next) {
    try {
      await LessonService.deleteLesson(req.userId, req.params.id);
      res.json({
        message: 'Lesson deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonController();

