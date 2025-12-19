const ProfessorRepository = require('../repositories/ProfessorRepository');

class ProfessorService {
  async getAllProfessors(filters = {}) {
    const professors = await ProfessorRepository.findAllWithDetails(filters);
    
    // Calculate average rating for each professor
    return professors.map(prof => {
      const profData = prof.toJSON();
      // Note: In real app, would calculate from reviews
      profData.averageRating = 4.5;
      return profData;
    });
  }

  async getProfessorById(id) {
    const professor = await ProfessorRepository.findByIdWithDetails(id);
    if (!professor) {
      throw new Error('Professor not found');
    }

    const profData = professor.toJSON();
    
    // Calculate average rating
    if (profData.reviews && profData.reviews.length > 0) {
      const totalRating = profData.reviews.reduce((sum, r) => sum + r.rating, 0);
      profData.averageRating = totalRating / profData.reviews.length;
    } else {
      profData.averageRating = 0;
    }

    return profData;
  }

  async updateProfessorProfile(userId, data) {
    const professor = await ProfessorRepository.findByUserId(userId);
    if (!professor) {
      throw new Error('Professor profile not found');
    }

    const allowedFields = ['headline', 'subjects', 'hourlyRate'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return await professor.update(updateData);
  }
}

module.exports = new ProfessorService();

