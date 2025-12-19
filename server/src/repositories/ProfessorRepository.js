const BaseRepository = require('./BaseRepository');
const db = require('../models');
const { Op } = require('sequelize');

class ProfessorRepository extends BaseRepository {
  constructor() {
    super(db.Professor);
  }

  async findByUserId(userId) {
    return await this.model.findOne({ where: { userId } });
  }

  async findAllWithDetails(filters = {}) {
    const where = {};
    
    if (filters.verified !== undefined) {
      where.verified = filters.verified;
    }

    const include = [
      {
        model: db.User,
        as: 'user',
        include: [{ model: db.Profile, as: 'profile' }],
      },
    ];

    // Add name filter through profile
    if (filters.name) {
      include[0].include[0].where = {
        fullName: { [Op.like]: `%${filters.name}%` },
      };
      include[0].required = true;
      include[0].include[0].required = true;
    }

    // Add subject filter
    if (filters.subject) {
      where.subjects = { [Op.like]: `%${filters.subject}%` };
    }

    // Add rating filter - would need to calculate avg rating
    const options = {
      where,
      include,
    };

    return await this.model.findAll(options);
  }

  async findByIdWithDetails(id) {
    return await this.model.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'user',
          include: [{ model: db.Profile, as: 'profile' }],
        },
        {
          model: db.Course,
          as: 'courses',
          where: { published: true },
          required: false,
        },
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
          required: false,
        },
      ],
    });
  }
}

module.exports = new ProfessorRepository();

