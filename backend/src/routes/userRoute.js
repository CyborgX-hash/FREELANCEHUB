const express = require("express");
const router = express.Router();

const {
  createUserMiddleware,
  loginUserMiddleware,
  updateUserMiddleware,
} = require("../middlewares/userMiddleware");

const { authenticate } = require("../utils/auth");

// Repository
const UserRepository = require("../repositories/UserRepository");

// Service
const UserService = require("../services/UserService");

// Controller
const UserController = require("../controllers/userController");

// Dependency Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const { authLimiter, writeLimiter } = require("../middlewares/rateLimitMiddleware");

// Routes
router.post("/send-otp", authLimiter, userController.sendOtp);

router.post("/register", authLimiter, userController.register);

router.post("/login", authLimiter, loginUserMiddleware, userController.login);

router.post("/logout", authenticate, userController.logout);

router.get("/me", authenticate, userController.getMe);

router.put(
  "/update",
  authenticate,
  writeLimiter,
  updateUserMiddleware,
  userController.update
);

module.exports = router;