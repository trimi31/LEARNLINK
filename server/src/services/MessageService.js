// MessageService.js - Dren: handles conversations and messages

const ConversationRepository = require('../repositories/ConversationRepository');
const MessageRepository = require('../repositories/MessageRepository');
const StudentRepository = require('../repositories/StudentRepository');
const ProfessorRepository = require('../repositories/ProfessorRepository');

class MessageService {
  async getMyConversations(userId, userRole) {
    return await ConversationRepository.findByUser(userId, userRole);
  }

  async createConversation(userId, userRole, data) {
    // only students can start conversations with professors
    if (userRole !== 'STUDENT') {
      throw new Error('Only students can initiate conversations');
    }

    const student = await StudentRepository.findByUserId(userId);
    if (!student) {
      throw new Error('Student profile not found');
    }

    const professor = await ProfessorRepository.findById(data.professorId);
    if (!professor) {
      throw new Error('Professor not found');
    }

    const conversation = await ConversationRepository.findOrCreate(
      student.id,
      data.professorId
    );

    return await ConversationRepository.findByIdWithParticipants(conversation.id);
  }

  async getConversationMessages(userId, userRole, conversationId) {
    const conversation = await ConversationRepository.findByIdWithParticipants(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // make sure user is part of this conversation
    const isParticipant =
      conversation.student.userId === userId ||
      conversation.professor.userId === userId;

    if (!isParticipant) {
      throw new Error('Unauthorized');
    }

    return await MessageRepository.findByConversationId(conversationId);
  }

  async sendMessage(userId, conversationId, content) {
    const conversation = await ConversationRepository.findByIdWithParticipants(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const isParticipant =
      conversation.student.userId === userId ||
      conversation.professor.userId === userId;

    if (!isParticipant) {
      throw new Error('Unauthorized');
    }

    const message = await MessageRepository.create({
      conversationId,
      senderUserId: userId,
      content,
    });

    await conversation.update({ updatedAt: new Date() });

    return await MessageRepository.findById(message.id, {
      include: [
        {
          model: require('../models').User,
          as: 'sender',
          include: [{ model: require('../models').Profile, as: 'profile' }],
        },
      ],
    });
  }
}

module.exports = new MessageService();
