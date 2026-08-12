import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getConversations } from "../api";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import BotChatWindow from "../components/BotChatWindow";
import "./ChatPage.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const convIdFromUrl = searchParams.get("id");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState(convIdFromUrl ? "direct" : "bot"); // "bot" by default, or "direct" if url id present
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchConvs = async () => {
      setLoading(true);
      const res = await getConversations();
      if (res.conversations) {
        setConversations(res.conversations);

        if (convIdFromUrl) {
          const matched = res.conversations.find(
            (c) => c.id === Number(convIdFromUrl)
          );
          if (matched) setActiveConv(matched);
        } else if (res.conversations.length > 0 && !activeConv) {
          setActiveConv(res.conversations[0]);
        }
      }
      setLoading(false);
    };

    fetchConvs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, convIdFromUrl]);

  return (
    <div className="chat-page-container">
      {/* Top Navbar */}
      <nav className="chat-page-nav">
        <div className="logo" onClick={() => navigate("/")}>
          FreelanceHub
        </div>
        <button
          className="sketchy-btn secondary"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* Main Content Layout */}
      <div className="chat-page-content">
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <button
              className={`sidebar-tab-btn ${activeTab === "direct" ? "active" : ""}`}
              onClick={() => setActiveTab("direct")}
            >
              💬 Direct Messages
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === "bot" ? "active" : ""}`}
              onClick={() => setActiveTab("bot")}
            >
              🤖 AI Help Support
            </button>
          </div>
          {activeTab === "direct" && (
            loading ? (
              <div className="chat-loading">
                <div className="loader-ring"></div>
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConv?.id}
                onSelectConversation={(conv) => setActiveConv(conv)}
                currentUserId={currentUserId}
              />
            )
          )}
          {activeTab === "bot" && (
            <div style={{ padding: "16px", color: "var(--pencil)" }}>
              <p><strong>🤖 AI Support Mode Active</strong></p>
              <small>Use the main window to resolve general queries about projects, bids, or accounts.</small>
            </div>
          )}
        </aside>

        <main className="chat-main-panel">
          {activeTab === "bot" ? (
            <BotChatWindow />
          ) : activeConv ? (
            <ChatWindow
              conversation={activeConv}
              currentUserId={currentUserId}
            />
          ) : (
            <div className="no-chat-selected">
              <h3>💬 Select a conversation to start chatting</h3>
              <p>Connect with freelancers or clients directly on FreelanceHub.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
