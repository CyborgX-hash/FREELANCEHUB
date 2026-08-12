const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

const ProjectRepository = require("../repositories/ProjectRepository");
const ProjectService = require("../services/ProjectService");
const ProjectController = require("../controllers/projectController");

const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

const { writeLimiter, generalLimiter } = require("../middlewares/rateLimitMiddleware");

// CREATE PROJECT (Only Client)
router.post("/create", authMiddleware, writeLimiter, projectController.create);

// GET ALL PROJECTS
router.get("/", generalLimiter, projectController.getAll);

// ⭐ IMPORTANT: must come BEFORE "/:id"
router.get("/client/:clientId", authMiddleware, generalLimiter, projectController.getByClient);

// GET PROJECT BY ID
router.get("/:id", generalLimiter, projectController.getById);

// UPDATE PROJECT (Only Owner/Admin)
router.put("/:id", authMiddleware, writeLimiter, projectController.update);

// DELETE PROJECT (Only Owner/Admin)
router.delete("/:id", authMiddleware, writeLimiter, projectController.delete);

module.exports = router;