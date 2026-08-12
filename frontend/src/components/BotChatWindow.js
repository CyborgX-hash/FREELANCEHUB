import React, { useState, useEffect, useRef } from "react";
import { sendBotQuery } from "../api";
import "./BotChatWindow.css";

const BotChatWindow = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "bot",
      content:
        "👋 Hello! I am the **FreelanceHub AI Assistant**. Ask me any question about project posting, proposal submissions, client & freelancer messaging, or profile settings!",
      suggestions: [
        "How to post a project?",
        "How to submit a proposal?",
        "How to edit my profile?",
        "How direct messaging works?",
      ],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now() + "-user",
      sender: "user",
      content: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    let reply = "";
    let suggestions = [];

    try {
      const res = await sendBotQuery(query.trim());
      if (res && res.reply) {
        reply = res.reply;
        suggestions = res.suggestions || [];
      }
    } catch (e) {
      console.warn("Backend bot API unreachable, using client fallback", e);
    }

    // Client-side Knowledge Base fallback if backend fails or returns no reply
    if (!reply) {
      const q = query.toLowerCase();
      if (q.includes("post") || q.includes("job") || q.includes("project") || q.includes("create")) {
        reply = "📌 **Posting a Project (Clients only):**\n1. Go to your **Dashboard**.\n2. Click on **➕ Post a Project**.\n3. Fill in title, description, skills required, budget range, and category.\n4. Click **Publish** to make your project visible!";
        suggestions = ["How to view applicants?", "How to submit a proposal?"];
      } else if (q.includes("apply") || q.includes("proposal") || q.includes("bid")) {
        reply = "💼 **Submitting a Proposal (Freelancers only):**\n1. Browse open jobs via **🔍 Browse Jobs**.\n2. Click on a project to view details.\n3. Click **Apply Now**, write your cover letter, set your bid amount (₹), and submit!\n4. Track your proposals under **📄 My Applications**.";
        suggestions = ["How to message clients?", "How to edit my profile?"];
      } else if (q.includes("message") || q.includes("chat") || q.includes("direct")) {
        reply = "💬 **Direct Messaging:**\n- **Freelancers** can message a client directly from the Project Details page or via their applications list.\n- **Clients** can message any applicant directly from the **Applied Freelancers** page.\n- Use the floating chat button at the bottom-right to access all your direct chats anytime!";
        suggestions = ["How to post a project?", "How to submit a proposal?"];
      } else if (q.includes("profile") || q.includes("edit") || q.includes("bio")) {
        reply = "👤 **Updating Profile:**\n1. Click your profile avatar in the navigation bar.\n2. Go to **Profile Page**.\n3. Update your bio, skills, experience, portfolio URL, or org info and click **Save Changes**.";
        suggestions = ["How to submit a proposal?", "How to post a project?"];
      } else {
        reply = "👋 Here are a few common topics I can help you with on FreelanceHub:";
        suggestions = ["How to post a project?", "How to submit a proposal?", "How to edit my profile?", "How direct messaging works?"];
      }
    }

    const botMsg = {
      id: Date.now() + "-bot",
      sender: "bot",
      content: reply,
      suggestions: suggestions,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="bot-chat-window">
      {/* Header */}
      <div className="bot-chat-header">
        {onBack && (
          <button className="chat-back-btn" onClick={onBack}>
            ←
          </button>
        )}
        <div className="bot-header-title">
          <h3>🤖 Help & Support Assistant</h3>
          <span className="bot-subtitle">Automated Instant Answers</span>
        </div>
      </div>

      {/* Messages */}
      <div className="bot-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bot-msg-wrapper ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <div className={`bot-msg-bubble ${msg.sender === "user" ? "user" : "bot"}`}>
              <p className="bot-msg-text">{msg.content}</p>

              {/* Suggestions Pills */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="bot-suggestions">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      className="suggestion-chip"
                      onClick={() => handleSend(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <span className="bot-msg-time">{msg.time}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="bot-typing">
            <div className="loader-ring"></div>
            <span>Assistant is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        className="bot-input-area"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="sketchy-input bot-input"
          placeholder="Ask a basic query..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="sketchy-btn filled" disabled={loading}>
          Ask 🤖
        </button>
      </form>
    </div>
  );
};

export default BotChatWindow;
