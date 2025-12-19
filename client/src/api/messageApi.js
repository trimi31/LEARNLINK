import axios from './axios';

export const messageApi = {
  getConversations: () => axios.get('/conversations'),
  createConversation: (data) => axios.post('/conversations', data),
  getMessages: (conversationId) => axios.get(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, data) => axios.post(`/conversations/${conversationId}/messages`, data),
};

