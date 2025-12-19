const BaseRepository = require('./BaseRepository');
const db = require('../models');

class StudentRepository extends BaseRepository {
  constructor() {
    super(db.Student);
  }

  async findByUserId(userId) {
    return await this.model.findOne({ where: { userId } });
  }
}

module.exports = new StudentRepository();

