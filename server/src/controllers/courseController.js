const CourseService = require('../services/CourseService');

class CourseController {
  async getAllCourses(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        level: req.query.level,
        professorId: req.query.professorId,
        search: req.query.search,
      };

      const courses = await CourseService.getAllCourses(filters);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req, res, next) {
    try {
      const course = await CourseService.getCourseById(req.params.id);
      res.json(course);
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req, res, next) {
    try {
      const course = await CourseService.createCourse(req.userId, req.body);
      res.status(201).json({
        message: 'Course created successfully',
        course,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req, res, next) {
    try {
      const course = await CourseService.updateCourse(
        req.userId,
        req.params.id,
        req.body
      );
      res.json({
        message: 'Course updated successfully',
        course,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req, res, next) {
    try {
      await CourseService.deleteCourse(req.userId, req.params.id);
      res.json({
        message: 'Course deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyCourses(req, res, next) {
    try {
      const courses = await CourseService.getMyCourses(req.userId);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();

