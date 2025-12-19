const BaseRepository = require('./BaseRepository');
const db = require('../models');

class LessonRepository extends BaseRepository {
  constructor() {
    super(db.Lesson);
  }

  async findByCourseId(courseId) {
    return await this.model.findAll({
      where: { courseId },
      order: [['createdAt', 'ASC']],
    });
  }

  async findByIdWithCourse(id) {
    return await this.model.findByPk(id, {
      include: [{ model: db.Course, as: 'course' }],
    });
  }
}

module.exports = new LessonRepository();

