const ProfileService = require('../services/ProfileService');

class ProfileController {
  async getMyProfile(req, res, next) {
    try {
      const profile = await ProfileService.getMyProfile(req.userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req, res, next) {
    try {
      const profile = await ProfileService.updateMyProfile(req.userId, req.body);
      res.json({
        message: 'Profile updated successfully',
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();

