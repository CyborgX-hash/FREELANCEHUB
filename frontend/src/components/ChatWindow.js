import React, { useState, useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { sendMessageApi, getMessages } from "../api";
import "./ChatWindow.css";

const ChatWindow = ({ conversation, currentUserId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const socket = getSocket();
  const isClient = conversation.client.id === currentUserId;
  const otherUser = isClient ? conversation.freelancer : conversation.client;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping]);

  // Load initial messages and join socket room
  useEffect(() => {
    let isMounted = true;

    const loadMsg = async () => {
      setLoading(true);
      const res = await getMessages(conversation.id);
      if (isMounted) {
        if (res.messages) {
          setMessages(res.messages);
        }
        setLoading(false);
      }
    };

    loadMsg();

    if (socket) {
      socket.emit("join_conversation", conversation.id);

      const handleNewMessage = ({ conversationId, message }) => {
        if (conversationId === conversation.id) {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      };

      const handleUserTyping = ({ conversationId, userId }) => {
        if (conversationId === conversation.id && userId !== currentUserId) {
          setOtherUserTyping(true);
        }
      };

      const handleUserStopTyping = ({ conversationId, userId }) => {
        if (conversationId === conversation.id && userId !== currentUserId) {
          setOtherUserTyping(false);
        }
      };

      const handleMessagesRead = ({ conversationId }) => {
        if (conversationId === conversation.id) {
          setMessages((prev) =>
            prev.map((m) => ({ ...m, is_read: true }))
          );
        }
      };

      socket.on("new_message", handleNewMessage);
      socket.on("user_typing", handleUserTyping);
      socket.on("user_stop_typing", handleUserStopTyping);
      socket.on("messages_read", handleMessagesRead);

      return () => {
        isMounted = false;
        socket.emit("leave_conversation", conversation.id);
        socket.off("new_message", handleNewMessage);
        socket.off("user_typing", handleUserTyping);
        socket.off("user_stop_typing", handleUserStopTyping);
        socket.off("messages_read", handleMessagesRead);
      };
    }
  }, [conversation.id, currentUserId, socket]);

  const handleTyping = (e) => {
    setInputText(e.target.value);

    if (socket) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", conversation.id);
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("stop_typing", conversation.id);
      }, 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText.trim();
    setInputText("");

    if (socket) {
      socket.emit("stop_typing", conversation.id);
      setIsTyping(false);
      socket.emit("send_message", {
        conversationId: conversation.id,
        content,
      });
    } else {
      // Fallback via HTTP API
      const res = await sendMessageApi(conversation.id, content);
      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        {onBack && (
          <button className="chat-back-btn" onClick={onBack}>
            ←
          </button>
        )}
        <div className="chat-header-info">
          <h3>💬 {otherUser.name || otherUser.username}</h3>
          <span className="chat-header-project">
            Project: {conversation.project?.title || "Freelance Project"}
          </span>
        </div>
        <span className="sketchy-badge">
          {isClient ? "Freelancer" : "Client"}
        </span>
      </div>

      {/* Messages list */}
      <div className="messages-container">
        {loading ? (
          <div className="chat-loading">
            <div className="loader-ring"></div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <p>👋 Say hello to {otherUser.name || otherUser.username}!</p>
            <small>Discuss project details, requirements, and timelines here.</small>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id || Math.random()}
                className={`message-bubble-wrapper ${isMe ? "me" : "them"}`}
              >
                <div className={`message-bubble ${isMe ? "me" : "them"}`}>
                  <p className="message-content">{msg.content}</p>
                  <div className="message-meta">
                    <span className="message-time">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && (
                      <span className={`read-status ${msg.is_read ? "read" : ""}`}>
                        {msg.is_read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {otherUserTyping && (
          <div className="typing-indicator">
            <span>{otherUser.name || otherUser.username} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="sketchy-input chat-input"
          placeholder="Write a message..."
          value={inputText}
          onChange={handleTyping}
        />
        <button type="submit" className="sketchy-btn filled send-btn">
          Send 🚀
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
