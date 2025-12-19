const BaseRepository = require('./BaseRepository');
const db = require('../models');
const { Op } = require('sequelize');

class CourseRepository extends BaseRepository {
  constructor() {
    super(db.Course);
  }

  async findAllPublished(filters = {}) {
    const where = { published: true };

    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.level) {
      where.level = filters.level;
    }
    if (filters.professorId) {
      where.professorId = filters.professorId;
    }
    // Text search across title and description
    if (filters.search) {
      where[Op.or] = [
        { tittle: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } },
        { category: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    return await this.model.findAll({
      where,
      include: [
        {
          model: db.Professor,
          as: 'professor',
          include: [
            {
              model: db.User,
              as: 'user',
              include: [{ model: db.Profile, as: 'profile' }],
            },
          ],
        },
        { model: db.Lesson, as: 'lessons' },
      ],
    });
  }

  async findByIdWithDetails(id) {
    return await this.model.findByPk(id, {
      include: [
        {
          model: db.Professor,
          as: 'professor',
          include: [
            {
              model: db.User,
              as: 'user',
              include: [{ model: db.Profile, as: 'profile' }],
            },
          ],
        },
        { model: db.Lesson, as: 'lessons' },
        {
          model: db.Review,
          as: 'reviews',
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
        },
      ],
    });
  }

  async findByProfessorId(professorId) {
    return await this.model.findAll({
      where: { professorId },
      include: [{ model: db.Lesson, as: 'lessons' }],
    });
  }
}

module.exports = new CourseRepository();

