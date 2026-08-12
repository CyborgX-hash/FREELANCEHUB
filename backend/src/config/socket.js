const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { prisma } = require("./database");

// Track online users: userId -> Set of socket IDs
const onlineUsers = new Map();

// ─── Token Bucket Algorithm for Real-Time Socket Events ───
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity; // Max burst limit
    this.refillRate = refillRate; // Tokens added per second
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.FRONTEND_LOCAL_URL,
        process.env.FRONTEND_SERVER_URL,
      ].filter(Boolean),
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // ─── JWT Authentication Middleware ───
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Attach Token Buckets to socket session
    // Message bucket: capacity 10, refill 2 per sec
    const messageBucket = new TokenBucket(10, 2);
    // Typing bucket: capacity 5, refill 1 per sec
    const typingBucket = new TokenBucket(5, 1);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Join personal room for notifications
    socket.join(`user:${userId}`);

    console.log(`User ${userId} connected (socket: ${socket.id})`);

    // ─── Join a conversation room ───
    socket.on("join_conversation", async (conversationId) => {
      try {
        const parsedId = Number(conversationId);
        if (Number.isNaN(parsedId)) return;

        // Verify user is a participant
        const conversation = await prisma.conversation.findUnique({
          where: { id: parsedId },
        });

        if (
          !conversation ||
          (conversation.client_id !== userId &&
            conversation.freelancer_id !== userId)
        ) {
          return;
        }

        socket.join(`conversation:${parsedId}`);

        // Mark messages as read when joining
        await prisma.message.updateMany({
          where: {
            conversation_id: parsedId,
            sender_id: { not: userId },
            is_read: false,
          },
          data: { is_read: true },
        });

        // Notify the other participant that messages were read
        const otherUserId =
          conversation.client_id === userId
            ? conversation.freelancer_id
            : conversation.client_id;

        io.to(`user:${otherUserId}`).emit("messages_read", {
          conversationId: parsedId,
          readBy: userId,
        });
      } catch (err) {
        console.error("join_conversation error:", err);
      }
    });

    // ─── Leave a conversation room ───
    socket.on("leave_conversation", (conversationId) => {
      const parsedId = Number(conversationId);
      if (!Number.isNaN(parsedId)) {
        socket.leave(`conversation:${parsedId}`);
      }
    });

    // ─── Send a message ───
    socket.on("send_message", async ({ conversationId, content }) => {
      try {
        // Token Bucket Rate Limiting Check
        if (!messageBucket.consume()) {
          return socket.emit("rate_limit_exceeded", {
            ERROR: "You are sending messages too quickly. Please wait a moment.",
          });
        }

        const parsedId = Number(conversationId);
        if (Number.isNaN(parsedId) || !content || !content.trim()) return;

        // Verify user is a participant
        const conversation = await prisma.conversation.findUnique({
          where: { id: parsedId },
        });

        if (
          !conversation ||
          (conversation.client_id !== userId &&
            conversation.freelancer_id !== userId)
        ) {
          return;
        }

        // Create message in DB
        const message = await prisma.message.create({
          data: {
            conversation_id: parsedId,
            sender_id: userId,
            content: content.trim(),
          },
          include: {
            sender: {
              select: { id: true, name: true, username: true },
            },
          },
        });

        // Bump conversation timestamp
        await prisma.conversation.update({
          where: { id: parsedId },
          data: { updated_at: new Date() },
        });

        // Broadcast to the conversation room
        io.to(`conversation:${parsedId}`).emit("new_message", {
          conversationId: parsedId,
          message,
        });

        // Also notify the other user's personal room (for badge updates)
        const otherUserId =
          conversation.client_id === userId
            ? conversation.freelancer_id
            : conversation.client_id;

        io.to(`user:${otherUserId}`).emit("message_notification", {
          conversationId: parsedId,
          message,
        });
      } catch (err) {
        console.error("send_message error:", err);
      }
    });

    // ─── Typing indicators ───
    socket.on("typing", (conversationId) => {
      if (!typingBucket.consume()) return; // Rate limit typing events silently

      const parsedId = Number(conversationId);
      if (!Number.isNaN(parsedId)) {
        socket.to(`conversation:${parsedId}`).emit("user_typing", {
          conversationId: parsedId,
          userId,
          userName: socket.user.name,
        });
      }
    });

    socket.on("stop_typing", (conversationId) => {
      const parsedId = Number(conversationId);
      if (!Number.isNaN(parsedId)) {
        socket.to(`conversation:${parsedId}`).emit("user_stop_typing", {
          conversationId: parsedId,
          userId,
        });
      }
    });

    // ─── Mark messages as read ───
    socket.on("mark_read", async (conversationId) => {
      try {
        const parsedId = Number(conversationId);
        if (Number.isNaN(parsedId)) return;

        await prisma.message.updateMany({
          where: {
            conversation_id: parsedId,
            sender_id: { not: userId },
            is_read: false,
          },
          data: { is_read: true },
        });

        const conversation = await prisma.conversation.findUnique({
          where: { id: parsedId },
        });

        if (conversation) {
          const otherUserId =
            conversation.client_id === userId
              ? conversation.freelancer_id
              : conversation.client_id;

          io.to(`user:${otherUserId}`).emit("messages_read", {
            conversationId: parsedId,
            readBy: userId,
          });
        }
      } catch (err) {
        console.error("mark_read error:", err);
      }
    });

    // ─── Disconnect ───
    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
      console.log(`User ${userId} disconnected (socket: ${socket.id})`);
    });
  });

  return io;
}

module.exports = { setupSocket, onlineUsers };
