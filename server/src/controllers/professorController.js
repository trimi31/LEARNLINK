const ProfessorService = require('../services/ProfessorService');

class ProfessorController {
  async getAllProfessors(req, res, next) {
    try {
      const filters = {
        name: req.query.search || req.query.name,
        subject: req.query.subject,
        verified: req.query.verified,
      };

      const professors = await ProfessorService.getAllProfessors(filters);
      res.json(professors);
    } catch (error) {
      next(error);
    }
  }

  async getProfessorById(req, res, next) {
    try {
      const professor = await ProfessorService.getProfessorById(req.params.id);
      res.json(professor);
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req, res, next) {
    try {
      const professor = await ProfessorService.updateProfessorProfile(req.userId, req.body);
      res.json({
        message: 'Professor profile updated successfully',
        professor,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfessorController();

