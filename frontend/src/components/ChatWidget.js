import React, { useState, useEffect } from "react";
import { getConversations, getUnreadCount } from "../api";
import { getSocket } from "../socket";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import BotChatWindow from "./BotChatWindow";
import "./ChatWidget.css";

const ChatWidget = ({ currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bot"); // Default to AI Chat System
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const socket = getSocket();

  // Load conversations & unread count for authenticated users
  const loadChatData = async () => {
    if (!currentUserId) return;

    const [convRes, unreadRes] = await Promise.all([
      getConversations(),
      getUnreadCount(),
    ]);

    if (convRes?.conversations) {
      setConversations(convRes.conversations);
    }
    if (unreadRes?.unreadCount !== undefined) {
      setUnreadCount(unreadRes.unreadCount);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadChatData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageNotification = () => {
      loadChatData();
    };

    const handleMessagesRead = () => {
      loadChatData();
    };

    socket.on("message_notification", handleMessageNotification);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("message_notification", handleMessageNotification);
      socket.off("messages_read", handleMessagesRead);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const toggleOpen = () => {
    if (!isOpen && currentUserId) {
      loadChatData();
    }
    setIsOpen(!isOpen);
  };

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
  };

  return (
    <div className="chat-widget-wrapper">
      {/* Floating Action Button */}
      <button className="chat-fab-btn" onClick={toggleOpen} title="Open Assistant / Messaging">
        🤖
        {unreadCount > 0 && <span className="fab-badge">{unreadCount}</span>}
      </button>

      {/* Chat Popover Window */}
      {isOpen && (
        <div className="chat-popover">
          <div className="popover-top-bar">
            <div className="tab-switcher">
              <button
                className={`tab-btn ${activeTab === "bot" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("bot");
                  setActiveConversation(null);
                }}
              >
                🤖 AI Assistant
              </button>
              {currentUserId && (
                <button
                  className={`tab-btn ${activeTab === "direct" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("direct");
                    setActiveConversation(null);
                  }}
                >
                  💬 Direct Messages
                </button>
              )}
            </div>
            <button
              className="popover-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="popover-body">
            {activeTab === "bot" ? (
              <BotChatWindow />
            ) : activeConversation ? (
              <ChatWindow
                conversation={activeConversation}
                currentUserId={currentUserId}
                onBack={() => {
                  setActiveConversation(null);
                  loadChatData();
                }}
              />
            ) : (
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversation?.id}
                onSelectConversation={handleSelectConversation}
                currentUserId={currentUserId}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
