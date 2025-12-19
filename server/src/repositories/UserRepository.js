const BaseRepository = require('./BaseRepository');
const db = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super(db.User);
  }

  async findByEmail(email) {
    return await this.model.findOne({
      where: { email },
      include: [
        { model: db.Profile, as: 'profile' },
        { model: db.Student, as: 'studentProfile' },
        { model: db.Professor, as: 'professorProfile' },
      ],
    });
  }

  async findByIdWithRelations(id) {
    return await this.model.findByPk(id, {
      include: [
        { model: db.Profile, as: 'profile' },
        { model: db.Student, as: 'studentProfile' },
        { model: db.Professor, as: 'professorProfile' },
      ],
    });
  }
}

module.exports = new UserRepository();

