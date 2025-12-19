const MessageService = require('../services/MessageService');

class MessageController {
  async getMyConversations(req, res, next) {
    try {
      const conversations = await MessageService.getMyConversations(
        req.userId,
        req.userRole
      );
      res.json(conversations);
    } catch (error) {
      next(error);
    }
  }

  async createConversation(req, res, next) {
    try {
      const conversation = await MessageService.createConversation(
        req.userId,
        req.userRole,
        req.body
      );
      res.status(201).json({
        message: 'Conversation created successfully',
        conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversationMessages(req, res, next) {
    try {
      const messages = await MessageService.getConversationMessages(
        req.userId,
        req.userRole,
        req.params.id
      );
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const message = await MessageService.sendMessage(
        req.userId,
        req.params.id,
        req.body.content
      );
      res.status(201).json({
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();

