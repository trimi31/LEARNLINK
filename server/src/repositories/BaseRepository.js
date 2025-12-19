class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async findOne(options = {}) {
    return await this.model.findOne(options);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const record = await this.findById(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.findById(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }

  async count(options = {}) {
    return await this.model.count(options);
  }
}

module.exports = BaseRepository;

