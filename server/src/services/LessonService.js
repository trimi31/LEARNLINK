const LessonRepository = require('../repositories/LessonRepository');
const CourseRepository = require('../repositories/CourseRepository');
const ProfessorRepository = require('../repositories/ProfessorRepository');
const db = require('../models');

class LessonService {
  async createLesson(userId, courseId, data) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor || course.professorId !== professor.id) {
      throw new Error('Unauthorized');
    }

    return await LessonRepository.create({
      courseId,
      ...data,
    });
  }

  async updateLesson(userId, lessonId, data) {
    const lesson = await LessonRepository.findByIdWithCourse(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor || lesson.course.professorId !== professor.id) {
      throw new Error('Unauthorized');
    }

    const allowedFields = [
      'title',
      'description',
      'contentUrl',
      'durationMinutes',
      'price',
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return await lesson.update(updateData);
  }

  async deleteLesson(userId, lessonId) {
    const transaction = await db.sequelize.transaction();

    try {
      const lesson = await LessonRepository.findByIdWithCourse(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      const professor = await ProfessorRepository.findByUserId(userId);
      if (!professor || lesson.course.professorId !== professor.id) {
        throw new Error('Unauthorized');
      }

      await lesson.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new LessonService();

