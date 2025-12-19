const AvailabilityRepository = require('../repositories/AvailabilityRepository');
const ProfessorRepository = require('../repositories/ProfessorRepository');
const db = require('../models');

class AvailabilityService {
  async getById(id) {
    const availability = await db.Availability.findByPk(id, {
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
      ],
    });

    if (!availability) {
      throw new Error('Availability slot not found');
    }

    return availability;
  }
  async createAvailability(userId, data) {
    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor) {
      throw new Error('Professor profile not found');
    }

    // Validate times
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (startTime >= endTime) {
      throw new Error('End time must be after start time');
    }

    if (startTime < new Date()) {
      throw new Error('Start time cannot be in the past');
    }

    return await AvailabilityRepository.create({
      professorId: professor.id,
      startTime,
      endTime,
      timezone: data.timezone || 'UTC',
      isBooked: false,
    });
  }

  async getMyAvailability(userId) {
    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor) {
      throw new Error('Professor profile not found');
    }

    return await AvailabilityRepository.findByProfessorId(professor.id, true);
  }

  async deleteAvailability(userId, availabilityId) {
    const availability = await AvailabilityRepository.findById(availabilityId);
    if (!availability) {
      throw new Error('Availability slot not found');
    }

    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor || availability.professorId !== professor.id) {
      throw new Error('Unauthorized');
    }

    if (availability.isBooked) {
      throw new Error('Cannot delete booked availability slot');
    }

    await AvailabilityRepository.delete(availabilityId);
    return true;
  }

  async getProfessorAvailability(professorId) {
    return await AvailabilityRepository.findByProfessorId(professorId, false);
  }
}

module.exports = new AvailabilityService();

