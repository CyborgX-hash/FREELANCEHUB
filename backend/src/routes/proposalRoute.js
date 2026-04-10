const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");

// Repositories
const ApplicationRepository = require("../repositories/ApplicationRepository");
const ProjectRepository = require("../repositories/ProjectRepository");

// Service
const ProposalService = require("../services/ProposalService");

// Controller
const ProposalController = require("../controllers/proposalController");

// Dependency Injection
const applicationRepository = new ApplicationRepository();
const projectRepository = new ProjectRepository();
const proposalService = new ProposalService(
  applicationRepository,
  projectRepository
);
const proposalController = new ProposalController(proposalService);

router.post("/", authMiddleware, proposalController.create);

router.get(
  "/project/:projectId",
  authMiddleware,
  proposalController.getByProject
);

module.exports = router;