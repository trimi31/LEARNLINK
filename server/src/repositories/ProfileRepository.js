const BaseRepository = require('./BaseRepository');
const db = require('../models');

class ProfileRepository extends BaseRepository {
  constructor() {
    super(db.Profile);
  }

  async findByUserId(userId) {
    return await this.model.findOne({
      where: { userId },
      include: [{ model: db.User, as: 'user' }],
    });
  }

  async createOrUpdate(userId, data) {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return await existing.update(data);
    }
    return await this.create({ userId, ...data });
  }
}

module.exports = new ProfileRepository();

