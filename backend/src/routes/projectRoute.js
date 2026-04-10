const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

const ProjectRepository = require("../repositories/ProjectRepository");
const ProjectService = require("../services/ProjectService");
const ProjectController = require("../controllers/projectController");

const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

// CREATE PROJECT (Only Client)
router.post("/create", authMiddleware, projectController.create);

// GET ALL PROJECTS
router.get("/", projectController.getAll);

// ⭐ IMPORTANT: must come BEFORE "/:id"
router.get("/client/:clientId", authMiddleware, projectController.getByClient);

// GET PROJECT BY ID
router.get("/:id", projectController.getById);

// UPDATE PROJECT (Only Owner/Admin)
router.put("/:id", authMiddleware, projectController.update);

// DELETE PROJECT (Only Owner/Admin)
router.delete("/:id", authMiddleware, projectController.delete);

module.exports = router;