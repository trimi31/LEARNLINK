const AvailabilityService = require('../services/AvailabilityService');

class AvailabilityController {
  async getById(req, res, next) {
    try {
      const availability = await AvailabilityService.getById(req.params.id);
      res.json(availability);
    } catch (error) {
      next(error);
    }
  }

  async createAvailability(req, res, next) {
    try {
      const availability = await AvailabilityService.createAvailability(
        req.userId,
        req.body
      );
      res.status(201).json({
        message: 'Availability slot created successfully',
        availability,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyAvailability(req, res, next) {
    try {
      const availability = await AvailabilityService.getMyAvailability(req.userId);
      res.json(availability);
    } catch (error) {
      next(error);
    }
  }

  async deleteAvailability(req, res, next) {
    try {
      await AvailabilityService.deleteAvailability(req.userId, req.params.id);
      res.json({
        message: 'Availability slot deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfessorAvailability(req, res, next) {
    try {
      const availability = await AvailabilityService.getProfessorAvailability(
        req.params.professorId
      );
      res.json(availability);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AvailabilityController();

