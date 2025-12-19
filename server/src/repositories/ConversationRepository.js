const BaseRepository = require('./BaseRepository');
const db = require('../models');
const { Op } = require('sequelize');

class ConversationRepository extends BaseRepository {
  constructor() {
    super(db.Conversation);
  }

  async findByUser(userId, userRole) {
    const where = userRole === 'STUDENT'
      ? { '$student.userId$': userId }
      : { '$professor.userId$': userId };

    return await this.model.findAll({
      where,
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
      ],
      order: [['updatedAt', 'DESC']],
    });
  }

  async findOrCreate(studentId, professorId) {
    const [conversation] = await this.model.findOrCreate({
      where: { studentId, professorId },
      defaults: { studentId, professorId },
    });
    return conversation;
  }

  async findByIdWithParticipants(id) {
    return await this.model.findByPk(id, {
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
      ],
    });
  }
}

module.exports = new ConversationRepository();

