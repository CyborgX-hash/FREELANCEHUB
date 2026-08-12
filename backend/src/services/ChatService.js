const ApiError = require("../utils/ApiError");

class ChatService {
  constructor(chatRepository, applicationRepository, projectRepository) {
    this.chatRepository = chatRepository;
    this.applicationRepository = applicationRepository;
    this.projectRepository = projectRepository;
  }

  async getOrCreateConversation(user, data) {
    const { projectId, otherUserId } = data;

    if (!projectId || !otherUserId) {
      throw new ApiError("projectId and otherUserId are required", 400);
    }

    const parsedProjectId = Number(projectId);
    const parsedOtherUserId = Number(otherUserId);

    if (Number.isNaN(parsedProjectId) || Number.isNaN(parsedOtherUserId)) {
      throw new ApiError("Invalid projectId or otherUserId", 400);
    }

    if (user.id === parsedOtherUserId) {
      throw new ApiError("Cannot create a conversation with yourself", 400);
    }

    // Determine who is client and who is freelancer
    const project = await this.projectRepository.findById(parsedProjectId);

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    let clientId, freelancerId;

    if (project.client_id === user.id) {
      clientId = user.id;
      freelancerId = parsedOtherUserId;
    } else if (project.client_id === parsedOtherUserId) {
      clientId = parsedOtherUserId;
      freelancerId = user.id;
    } else {
      throw new ApiError("Invalid conversation participants for this project", 403);
    }

    // Verify an application link exists between the freelancer and project
    const application =
      await this.applicationRepository.findByProjectAndFreelancer(
        parsedProjectId,
        freelancerId
      );

    if (!application) {
      throw new ApiError(
        "A freelancer must have applied to this project to start a conversation",
        403
      );
    }

    // Try to find existing conversation
    let conversation =
      await this.chatRepository.findConversationByParticipants(
        parsedProjectId,
        clientId,
        freelancerId
      );

    if (!conversation) {
      conversation = await this.chatRepository.createConversation({
        project_id: parsedProjectId,
        client_id: clientId,
        freelancer_id: freelancerId,
      });
    }

    return {
      message: "Conversation ready",
      conversation,
    };
  }

  async getConversations(user) {
    const conversations =
      await this.chatRepository.findConversationsByUser(user.id);

    // Add unread count per conversation
    const enriched = conversations.map((conv) => {
      const lastMessage = conv.messages[0] || null;
      const unread =
        lastMessage && !lastMessage.is_read && lastMessage.sender_id !== user.id
          ? 1
          : 0;

      return {
        id: conv.id,
        project: conv.project,
        client: conv.client,
        freelancer: conv.freelancer,
        lastMessage,
        hasUnread: unread > 0,
        updated_at: conv.updated_at,
      };
    });

    return { conversations: enriched };
  }

  async getMessages(user, conversationId, query = {}) {
    const parsedConvId = Number(conversationId);

    if (Number.isNaN(parsedConvId)) {
      throw new ApiError("Invalid conversation id", 400);
    }

    const conversation =
      await this.chatRepository.findConversationById(parsedConvId);

    if (!conversation) {
      throw new ApiError("Conversation not found", 404);
    }

    // Ensure user is a participant
    if (
      conversation.client_id !== user.id &&
      conversation.freelancer_id !== user.id &&
      user.role !== "admin"
    ) {
      throw new ApiError("Forbidden", 403);
    }

    // Mark messages from the other user as read
    await this.chatRepository.markMessagesAsRead(parsedConvId, user.id);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;

    const result = await this.chatRepository.findMessagesByConversation(
      parsedConvId,
      { page, limit }
    );

    return {
      conversation: {
        id: conversation.id,
        project: conversation.project,
        client: conversation.client,
        freelancer: conversation.freelancer,
      },
      ...result,
    };
  }

  async sendMessage(user, conversationId, data) {
    const { content } = data;

    if (!content || !content.trim()) {
      throw new ApiError("Message content is required", 400);
    }

    const parsedConvId = Number(conversationId);

    if (Number.isNaN(parsedConvId)) {
      throw new ApiError("Invalid conversation id", 400);
    }

    const conversation =
      await this.chatRepository.findConversationById(parsedConvId);

    if (!conversation) {
      throw new ApiError("Conversation not found", 404);
    }

    // Ensure user is a participant
    if (
      conversation.client_id !== user.id &&
      conversation.freelancer_id !== user.id &&
      user.role !== "admin"
    ) {
      throw new ApiError("Forbidden", 403);
    }

    const message = await this.chatRepository.createMessage({
      conversation_id: parsedConvId,
      sender_id: user.id,
      content: content.trim(),
    });

    // Bump conversation timestamp so it sorts to the top
    await this.chatRepository.updateConversationTimestamp(parsedConvId);

    return {
      message: "Message sent",
      data: message,
    };
  }

  async getUnreadCount(userId) {
    const count = await this.chatRepository.getUnreadCount(userId);
    return { unreadCount: count };
  }
}

module.exports = ChatService;
