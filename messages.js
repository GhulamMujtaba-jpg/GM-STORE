// Chat/Messaging System
// Handles messages between customers and admin

class MessagingSystem {
  constructor() {}

  // Send message
  sendMessage(messageData) {
    const { conversationId, senderType, senderName, message, productId } = messageData;

    if (!conversationId || !message) {
      return { success: false, error: 'Missing required fields' };
    }

    const msg = db.create('messages', {
      conversationId,
      senderType: senderType || 'client', // 'client' or 'admin'
      senderName: senderName || 'Anonymous',
      message,
      productId: productId || null,
      isRead: false,
      attachments: []
    });

    return { success: true, message: msg };
  }

  // Get conversation messages
  getConversationMessages(conversationId) {
    return db.findBy('messages', 'conversationId', conversationId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // Mark message as read
  markAsRead(messageId) {
    const updated = db.update('messages', messageId, { isRead: true });
    return updated ? { success: true } : { success: false, error: 'Message not found' };
  }

  // Get unread count (Admin)
  getUnreadCount() {
    if (!auth.isAdmin()) {
      return 0;
    }
    const messages = db.read('messages');
    return messages.filter(m => !m.isRead && m.senderType === 'client').length;
  }

  // Get all conversations
  getAllConversations() {
    const messages = db.read('messages');
    const conversations = {};

    messages.forEach(msg => {
      if (!conversations[msg.conversationId]) {
        conversations[msg.conversationId] = {
          id: msg.conversationId,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          messageCount: 0,
          unreadCount: 0
        };
      }
      conversations[msg.conversationId].messageCount++;
      if (!msg.isRead && msg.senderType === 'client') {
        conversations[msg.conversationId].unreadCount++;
      }
    });

    return Object.values(conversations);
  }

  // Delete message (soft delete - just mark as deleted)
  deleteMessage(messageId) {
    const updated = db.update('messages', messageId, { deleted: true });
    return updated ? { success: true } : { success: false };
  }
}

const messaging = new MessagingSystem();