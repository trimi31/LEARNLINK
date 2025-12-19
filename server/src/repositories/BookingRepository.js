const BaseRepository = require('./BaseRepository');
const db = require('../models');

class BookingRepository extends BaseRepository {
  constructor() {
    super(db.Booking);
  }

  async findByStudentId(studentId) {
    return await this.model.findAll({
      where: { studentId },
      include: [
        {
          model: db.Availability,
          as: 'availability',
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
        {
          model: db.Course,
          as: 'course',
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
          model: db.Availability,
          as: 'availability',
        },
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
          model: db.Course,
          as: 'course',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByIdWithDetails(id) {
    return await this.model.findByPk(id, {
      include: [
        { model: db.Availability, as: 'availability' },
        { model: db.Student, as: 'student' },
        { model: db.Professor, as: 'professor' },
        { model: db.Course, as: 'course' },
      ],
    });
  }
}

module.exports = new BookingRepository();

