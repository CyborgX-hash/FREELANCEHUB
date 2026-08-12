import React from "react";
import "./ConversationList.css";

const ConversationList = ({ conversations, activeConversationId, onSelectConversation, currentUserId }) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="no-conversations">
        <p>No active conversations yet.</p>
        <small>Start chatting with clients or freelancers on your project applications!</small>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {conversations.map((conv) => {
        const isClient = conv.client.id === currentUserId;
        const otherUser = isClient ? conv.freelancer : conv.client;
        const isActive = conv.id === activeConversationId;
        const lastMsg = conv.lastMessage;

        return (
          <div
            key={conv.id}
            className={`conversation-item ${isActive ? "active" : ""} ${conv.hasUnread ? "unread" : ""}`}
            onClick={() => onSelectConversation(conv)}
          >
            <div className="conv-header">
              <span className="conv-name">{otherUser.name || otherUser.username}</span>
              <span className="conv-role-badge">{isClient ? "Freelancer" : "Client"}</span>
            </div>
            <div className="conv-project-title">
              📋 {conv.project?.title || "Project"}
            </div>
            {lastMsg && (
              <div className="conv-last-msg">
                <span className="msg-preview">
                  {lastMsg.sender_id === currentUserId ? "You: " : ""}{lastMsg.content}
                </span>
                <span className="msg-time">
                  {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            {conv.hasUnread && <span className="unread-dot"></span>}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
