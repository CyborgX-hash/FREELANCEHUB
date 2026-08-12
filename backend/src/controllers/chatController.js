class ChatController {
  constructor(chatService) {
    this.chatService = chatService;
  }

  getOrCreateConversation = async (req, res) => {
    try {
      const result = await this.chatService.getOrCreateConversation(
        req.user,
        req.body
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  getConversations = async (req, res) => {
    try {
      const result = await this.chatService.getConversations(req.user);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  getMessages = async (req, res) => {
    try {
      const result = await this.chatService.getMessages(
        req.user,
        req.params.id,
        req.query
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  sendMessage = async (req, res) => {
    try {
      const result = await this.chatService.sendMessage(
        req.user,
        req.params.id,
        req.body
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  getUnreadCount = async (req, res) => {
    try {
      const result = await this.chatService.getUnreadCount(req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  handleBotQuery = async (req, res) => {
    try {
      const botService = require("../services/BotService");
      const { message } = req.body;
      const response = await botService.processQuery(message);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        ERROR: "Failed to process AI assistant response",
      });
    }
  };
}

module.exports = ChatController;
