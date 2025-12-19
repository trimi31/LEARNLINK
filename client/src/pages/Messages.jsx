import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageApi } from '../api/messageApi';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const response = await messageApi.getConversations();
      setConversations(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to load conversations', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const response = await messageApi.getMessages(conversationId);
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }, []);

  // Handle recipientId query param (from professor profile)
  const handleRecipient = useCallback(async (convs) => {
    const recipientId = searchParams.get('recipientId');
    if (!recipientId) return;

    // Check if conversation already exists with this professor
    let existingConv = convs.find(c =>
      c.professor?.id === recipientId
    );

    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      // Create new conversation
      try {
        const response = await messageApi.createConversation({ professorId: recipientId });
        // API returns { message, conversation } so extract conversation
        const newConv = response.data.conversation || response.data;
        setConversations(prev => [newConv, ...prev]);
        setSelectedConversation(newConv);
      } catch (err) {
        console.error('Failed to create conversation', err);
      }
    }
    // Clear the query param
    setSearchParams({});
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    loadConversations().then(convs => {
      handleRecipient(convs);
    });
  }, [loadConversations, handleRecipient]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      if (window.innerWidth <= 768) setShowSidebar(false);
    }
  }, [selectedConversation, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await messageApi.sendMessage(selectedConversation.id, { content: newMessage });
      // API returns { message, data } so extract the actual message data
      const newMsg = response.data.data || response.data.message || response.data;
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conv) => {
    return user?.role === 'STUDENT' ? conv.professor?.user : conv.student?.user;
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      'var(--gradient-primary)',
      'var(--gradient-accent)',
      'var(--gradient-secondary)',
      'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    ];
    return gradients[index % gradients.length];
  };

  if (loading) return <Loader message="Loading messages..." />;

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="section-eyebrow">Communication</div>
        <h1 style={{ marginBottom: '0.375rem' }}>Messages</h1>
        <p style={{ fontSize: '1rem' }}>
          Chat with your {user?.role === 'STUDENT' ? 'professors' : 'students'}
        </p>
      </div>

      <Card className="card-elevated" style={{
        display: 'grid',
        gridTemplateColumns: showSidebar ? '320px 1fr' : '1fr',
        gap: 0,
        height: '600px',
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        {showSidebar && (
          <div style={{
            borderRight: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--border-light)',
              background: 'var(--bg-primary)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Conversations
              </h3>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
              {conversations.length > 0 ? conversations.map((conv, index) => {
                const otherUser = getOtherUser(conv);
                const isSelected = selectedConversation?.id === conv.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      border: 'none',
                      background: isSelected ? 'var(--bg-primary)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'all var(--duration-fast) var(--ease-out)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      borderLeft: isSelected ? '3px solid var(--brand-primary)' : '3px solid transparent'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-lg)',
                      background: getAvatarGradient(index),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {(otherUser?.profile?.fullName || 'U')[0].toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontWeight: 600,
                        marginBottom: '0.125rem',
                        fontSize: '0.9375rem',
                        color: 'var(--text-primary)'
                      }}>
                        {otherUser?.profile?.fullName || 'User'}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-tertiary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {otherUser?.email}
                      </div>
                    </div>
                  </button>
                );
              }) : (
                <div className="empty-state" style={{ padding: '2.5rem 1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.375rem' }}>No conversations</h3>
                  <p style={{ fontSize: '0.8125rem' }}>
                    {user?.role === 'STUDENT'
                      ? 'Book a session with a professor to start chatting'
                      : 'Wait for students to book sessions with you'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                background: 'var(--bg-primary)'
              }}>
                {!showSidebar && (
                  <Button variant="ghost" size="sm" onClick={() => setShowSidebar(true)} style={{ marginRight: '0.25rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </Button>
                )}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  {(getOtherUser(selectedConversation)?.profile?.fullName || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {getOtherUser(selectedConversation)?.profile?.fullName || 'User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {getOtherUser(selectedConversation)?.email}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="message-list" style={{
                flex: 1,
                padding: '1.5rem',
                background: 'var(--bg-secondary)'
              }}>
                {messages.length > 0 ? (
                  <>
                    {messages.map((msg) => {
                      const isSent = msg.senderUserId === user?.id;
                      const senderName = isSent
                        ? 'You'
                        : (msg.sender?.profile?.fullName || getOtherUser(selectedConversation)?.profile?.fullName || 'User');
                      return (
                        <div
                          key={msg.id}
                          style={{
                            display: 'flex',
                            justifyContent: isSent ? 'flex-end' : 'flex-start',
                            marginBottom: '1rem'
                          }}
                        >
                          <div style={{
                            maxWidth: '70%',
                            padding: '0.875rem 1rem',
                            borderRadius: isSent ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                            background: isSent
                              ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                              : 'var(--bg-primary)',
                            color: isSent ? 'white' : 'var(--text-primary)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: isSent ? 'none' : '1px solid var(--border-light)'
                          }}>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              marginBottom: '0.375rem',
                              color: isSent ? 'rgba(255,255,255,0.85)' : 'var(--brand-primary)'
                            }}>
                              {senderName}
                            </div>
                            <div style={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>{msg.content}</div>
                            <div style={{
                              fontSize: '0.6875rem',
                              marginTop: '0.375rem',
                              opacity: 0.7,
                              textAlign: 'right'
                            }}>
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👋</div>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} style={{
                padding: '1rem 1.25rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                gap: '0.75rem',
                background: 'var(--bg-primary)'
              }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input"
                  style={{ flex: 1 }}
                  disabled={sending}
                />
                <Button type="submit" variant="primary" disabled={sending || !newMessage.trim()}>
                  {sending ? (
                    <span className="btn-spinner" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-2xl)',
                background: 'var(--gray-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '2rem'
              }}>
                💬
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Select a conversation</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Mobile Media Query Styles */}
      <style>{`
        @media (max-width: 768px) {
          .container > div:last-child > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Messages;
