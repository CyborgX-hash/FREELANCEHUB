const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

// Repositories
const ApplicationRepository = require("../repositories/ApplicationRepository");
const ProjectRepository = require("../repositories/ProjectRepository");

// Services
const ApplicationService = require("../services/ApplicationService");

// Controllers
const ApplicationController = require("../controllers/applicationController");

// Dependency Injection
const applicationRepository = new ApplicationRepository();
const projectRepository = new ProjectRepository();
const applicationService = new ApplicationService(
  applicationRepository,
  projectRepository
);
const applicationController = new ApplicationController(applicationService);

// Routes
router.post("/apply", authMiddleware, applicationController.applyToProject);

router.get(
  "/project/:projectId",
  authMiddleware,
  applicationController.getByProject
);

router.get("/me", authMiddleware, applicationController.getByFreelancer);

router.delete("/:id", authMiddleware, applicationController.withdraw);

module.exports = router;