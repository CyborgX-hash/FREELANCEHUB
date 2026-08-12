const Groq = require("groq-sdk");

const SYSTEM_PROMPT = `You are the FreelanceHub AI Assistant — a helpful, friendly support bot embedded in a freelancing marketplace platform called FreelanceHub.

FreelanceHub connects Clients (who post projects) with Freelancers (who apply with proposals/bids). Key platform features:
- Clients can post projects with title, description, skills, budget range, category, and deadline
- Freelancers browse open jobs, apply with cover letters and bid amounts (₹)
- Both sides can message each other directly once a freelancer has applied to a project
- Users have profiles with bio, skills, experience, portfolio URL, and organizational info
- Dashboard has quick access cards for all features

Your job:
1. Answer ANY question the user asks — whether it's about the platform, freelancing tips, career advice, how to write proposals, how to get selected, pricing strategies, or general knowledge.
2. For platform-specific questions, give step-by-step instructions referencing FreelanceHub features.
3. For general freelancing/career questions, give practical, actionable advice.
4. Keep responses concise (under 200 words), friendly, and use markdown formatting with emojis.
5. Always end with 1-2 relevant follow-up suggestions.

Respond in this JSON format exactly:
{"reply": "your response here", "suggestions": ["suggestion 1", "suggestion 2"]}`;

class BotService {
  constructor() {
    this.groq = null;
    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    // Fast-path knowledge base for common platform queries (no API call needed)
    this.knowledgeBase = [
      {
        keywords: ["hello", "hi", "hey", "start", "help", "assistant"],
        response:
          "👋 Hello! I am the **FreelanceHub AI Assistant**. I can help with platform questions, freelancing tips, career advice, proposal writing, and more! What would you like to know?",
        suggestions: [
          "How to post a project?",
          "How to get selected as a freelancer?",
          "How to write a winning proposal?",
          "How does messaging work?",
        ],
      },
    ];
  }

  async processQuery(query) {
    if (!query || !query.trim()) {
      return {
        reply: "Please ask me a question!",
        suggestions: ["How to post a project?", "How to get selected?"],
      };
    }

    const cleanQuery = query.toLowerCase().trim();

    // Fast path: greetings only (everything else goes to LLM)
    for (const item of this.knowledgeBase) {
      if (item.keywords.some((kw) => cleanQuery === kw)) {
        return {
          reply: item.response,
          suggestions: item.suggestions,
        };
      }
    }

    // Use Groq LLM for all real queries
    if (this.groq) {
      try {
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: query.trim() },
          ],
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 512,
          response_format: { type: "json_object" },
        });

        const raw = chatCompletion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            reply: parsed.reply || raw,
            suggestions: parsed.suggestions || [],
          };
        }
      } catch (err) {
        console.error("Groq API error:", err.message);
        // Fall through to fallback
      }
    }

    // Fallback if no API key or API fails
    return {
      reply:
        "🤔 I'm not quite sure about that specific topic. Here are a few common topics I can assist you with:",
      suggestions: [
        "How to post a project?",
        "How to submit a proposal?",
        "How to edit my profile?",
        "How direct messaging works?",
      ],
    };
  }
}

module.exports = new BotService();
