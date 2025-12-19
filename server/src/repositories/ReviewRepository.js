const BaseRepository = require('./BaseRepository');
const db = require('../models');

class ReviewRepository extends BaseRepository {
  constructor() {
    super(db.Review);
  }

  async findByCourseId(courseId) {
    return await this.model.findAll({
      where: { courseId },
      include: [
        {
          model: db.Student,
          as: 'student',
          include: [
            {
              model: db.User,
              as: 'user',
              include: [{ model: db.Profile, as: 'profile' }],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByProfessorId(professorId) {
    return await this.model.findAll({
      where: { professorId },
      include: [
        {
          model: db.Student,
          as: 'student',
          include: [
            {
              model: db.User,
              as: 'user',
              include: [{ model: db.Profile, as: 'profile' }],
            },
          ],
        },
        { model: db.Course, as: 'course' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async checkExistingReview(studentId, courseId) {
    return await this.model.findOne({
      where: { studentId, courseId },
    });
  }
}

module.exports = new ReviewRepository();

