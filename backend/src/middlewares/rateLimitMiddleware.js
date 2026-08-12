const rateLimit = require("express-rate-limit");

// ─── Sliding Window Counter Limiter for Auth Routes ───
// Strict limits for login & signup to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes window
  max: 5, // Limit each IP to 5 auth requests per 3 minutes
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    ERROR: "ReTry after some time ",
  },
});

// ─── Sliding Window Counter Limiter for Write Operations ───
// Moderate limits for creating projects, submitting proposals, updating profiles
const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // Limit each IP to 20 write operations per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ERROR: "Too many actions submitted. Please slow down and try again in a minute.",
  },
});

// ─── Sliding Window Counter Limiter for General Read API Routes ───
// Generous limits for browsing projects, loading feeds, fetching metadata
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // Limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ERROR: "Too many requests. Please try again in a minute.",
  },
});

module.exports = {
  authLimiter,
  writeLimiter,
  generalLimiter,
};
