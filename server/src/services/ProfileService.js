const ProfileRepository = require('../repositories/ProfileRepository');
const UserRepository = require('../repositories/UserRepository');

class ProfileService {
  async getMyProfile(userId) {
    const profile = await ProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  async updateMyProfile(userId, data) {
    const allowedFields = [
      'fullName',
      'bio',
      'avatarUrl',
      'phone',
      'location',
      'education',
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return await ProfileRepository.createOrUpdate(userId, updateData);
  }
}

module.exports = new ProfileService();

