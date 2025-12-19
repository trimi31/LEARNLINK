const BaseRepository = require('./BaseRepository');
const db = require('../models');

class MessageRepository extends BaseRepository {
  constructor() {
    super(db.Message);
  }

  async findByConversationId(conversationId, limit = 100) {
    return await this.model.findAll({
      where: { conversationId },
      include: [
        {
          model: db.User,
          as: 'sender',
          include: [{ model: db.Profile, as: 'profile' }],
        },
      ],
      order: [['createdAt', 'ASC']],
      limit,
    });
  }
}

module.exports = new MessageRepository();

