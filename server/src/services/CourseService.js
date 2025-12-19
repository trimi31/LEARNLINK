// CourseService.js - Labinot: handles course CRUD operations

const CourseRepository = require('../repositories/CourseRepository');
const ProfessorRepository = require('../repositories/ProfessorRepository');
const db = require('../models');
const { Op } = require('sequelize');

class CourseService {
  async getAllCourses(filters = {}) {
    return await CourseRepository.findAllPublished(filters);
  }

  async getCourseById(id) {
    const course = await CourseRepository.findByIdWithDetails(id);
    if (!course) {
      throw new Error('Course not found');
    }

    const courseData = course.toJSON();

    // calculate average rating from all reviews
    if (courseData.reviews && courseData.reviews.length > 0) {
      const totalRating = courseData.reviews.reduce((sum, r) => sum + r.rating, 0);
      courseData.averageRating = totalRating / courseData.reviews.length;
    } else {
      courseData.averageRating = 0;
    }

    return courseData;
  }

  async createCourse(userId, data) {
    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor) {
      throw new Error('Professor profile not found');
    }

    return await CourseRepository.create({
      professorId: professor.id,
      ...data,
    });
  }

  async updateCourse(userId, courseId, data) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor || course.professorId !== professor.id) {
      throw new Error('Unauthorized');
    }

    // only allow these fields to be updated
    const allowedFields = ['tittle', 'description', 'price', 'category', 'level', 'published'];

    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return await course.update(updateData);
  }

  async deleteCourse(userId, courseId) {
    const transaction = await db.sequelize.transaction();

    try {
      const course = await CourseRepository.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const professor = await ProfessorRepository.findByUserId(userId);
      if (!professor || course.professorId !== professor.id) {
        throw new Error('Unauthorized');
      }

      // cant delete if there are active bookings
      const activeBookings = await db.Booking.count({
        where: {
          courseId,
          status: { [Op.in]: ['PENDING', 'CONFIRMED'] }
        },
        transaction
      });

      if (activeBookings > 0) {
        throw new Error('Cannot delete course with active bookings. Please cancel or complete all bookings first.');
      }

      await db.Review.destroy({ where: { courseId }, transaction });
      await course.destroy({ transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getMyCourses(userId) {
    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor) {
      throw new Error('Professor profile not found');
    }

    return await CourseRepository.findByProfessorId(professor.id);
  }
}

module.exports = new CourseService();
