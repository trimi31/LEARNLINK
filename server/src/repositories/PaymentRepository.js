const BaseRepository = require('./BaseRepository');
const db = require('../models');

class PaymentRepository extends BaseRepository {
  constructor() {
    super(db.Payment);
  }

  async findByStudentId(studentId) {
    return await this.model.findAll({
      where: { studentId },
      include: [
        { model: db.Booking, as: 'booking' },
        { model: db.Course, as: 'course' },
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
      order: [['createdAt', 'DESC']],
    });
  }

  async findPaidPayment(studentId, bookingId = null, courseId = null) {
    const where = {
      studentId,
      status: 'PAID',
    };

    if (bookingId) {
      where.bookingId = bookingId;
    }
    if (courseId) {
      where.courseId = courseId;
    }

    return await this.model.findOne({ where });
  }
}

module.exports = new PaymentRepository();

