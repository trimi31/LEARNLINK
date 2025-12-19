const BaseRepository = require('./BaseRepository');
const db = require('../models');
const { Op } = require('sequelize');

class AvailabilityRepository extends BaseRepository {
  constructor() {
    super(db.Availability);
  }

  async findByProfessorId(professorId, includeBooked = false) {
    const where = { professorId };
    if (!includeBooked) {
      where.isBooked = false;
    }

    return await this.model.findAll({
      where,
      order: [['startTime', 'ASC']],
    });
  }

  async findAvailableSlots(professorId, startDate, endDate) {
    return await this.model.findAll({
      where: {
        professorId,
        isBooked: false,
        startTime: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      order: [['startTime', 'ASC']],
    });
  }

  async markAsBooked(id) {
    const slot = await this.findById(id);
    if (!slot) return null;
    return await slot.update({ isBooked: true });
  }

  async markAsAvailable(id) {
    const slot = await this.findById(id);
    if (!slot) return null;
    return await slot.update({ isBooked: false });
  }
}

module.exports = new AvailabilityRepository();

