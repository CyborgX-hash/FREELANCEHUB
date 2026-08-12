const { prisma } = require("../config/database");

class ChatRepository {
  // ─── Conversation Methods ───

  async createConversation(data) {
    return prisma.conversation.create({
      data,
      include: {
        project: {
          select: { id: true, title: true },
        },
        client: {
          select: { id: true, name: true, username: true },
        },
        freelancer: {
          select: { id: true, name: true, username: true },
        },
      },
    });
  }

  async findConversationById(id) {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, title: true },
        },
        client: {
          select: { id: true, name: true, username: true },
        },
        freelancer: {
          select: { id: true, name: true, username: true },
        },
      },
    });
  }

  async findConversationByParticipants(projectId, clientId, freelancerId) {
    return prisma.conversation.findUnique({
      where: {
        project_id_client_id_freelancer_id: {
          project_id: projectId,
          client_id: clientId,
          freelancer_id: freelancerId,
        },
      },
      include: {
        project: {
          select: { id: true, title: true },
        },
        client: {
          select: { id: true, name: true, username: true },
        },
        freelancer: {
          select: { id: true, name: true, username: true },
        },
      },
    });
  }

  async findConversationsByUser(userId) {
    return prisma.conversation.findMany({
      where: {
        OR: [{ client_id: userId }, { freelancer_id: userId }],
      },
      orderBy: { updated_at: "desc" },
      include: {
        project: {
          select: { id: true, title: true },
        },
        client: {
          select: { id: true, name: true, username: true },
        },
        freelancer: {
          select: { id: true, name: true, username: true },
        },
        messages: {
          orderBy: { created_at: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            sender_id: true,
            is_read: true,
            created_at: true,
          },
        },
      },
    });
  }

  // ─── Message Methods ───

  async createMessage(data) {
    return prisma.message.create({
      data,
      include: {
        sender: {
          select: { id: true, name: true, username: true },
        },
      },
    });
  }

  async findMessagesByConversation(conversationId, { page = 1, limit = 50 } = {}) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversation_id: conversationId },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          sender: {
            select: { id: true, name: true, username: true },
          },
        },
      }),
      prisma.message.count({
        where: { conversation_id: conversationId },
      }),
    ]);

    return {
      messages: messages.reverse(),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markMessagesAsRead(conversationId, userId) {
    return prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: userId },
        is_read: false,
      },
      data: { is_read: true },
    });
  }

  async getUnreadCount(userId) {
    return prisma.message.count({
      where: {
        is_read: false,
        sender_id: { not: userId },
        conversation: {
          OR: [{ client_id: userId }, { freelancer_id: userId }],
        },
      },
    });
  }

  async updateConversationTimestamp(conversationId) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { updated_at: new Date() },
    });
  }
}

module.exports = ChatRepository;
