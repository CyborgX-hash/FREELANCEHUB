const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

// Repositories
const ChatRepository = require("../repositories/ChatRepository");
const ApplicationRepository = require("../repositories/ApplicationRepository");
const ProjectRepository = require("../repositories/ProjectRepository");

// Service
const ChatService = require("../services/ChatService");

// Controller
const ChatController = require("../controllers/chatController");

// Dependency Injection
const chatRepository = new ChatRepository();
const applicationRepository = new ApplicationRepository();
const projectRepository = new ProjectRepository();
const chatService = new ChatService(
  chatRepository,
  applicationRepository,
  projectRepository
);
const chatController = new ChatController(chatService);

// Routes

// Create or get existing conversation
router.post(
  "/conversations",
  authMiddleware,
  chatController.getOrCreateConversation
);

// Get all conversations for the authenticated user
router.get("/conversations", authMiddleware, chatController.getConversations);

// Get messages for a conversation
router.get(
  "/conversations/:id/messages",
  authMiddleware,
  chatController.getMessages
);

// Send a message in a conversation
router.post(
  "/conversations/:id/messages",
  authMiddleware,
  chatController.sendMessage
);

// Get unread message count
router.get("/unread", authMiddleware, chatController.getUnreadCount);

// General automated AI support assistant bot
router.post("/bot", chatController.handleBotQuery);

module.exports = router;
