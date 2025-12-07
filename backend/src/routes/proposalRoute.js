const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const proposalController = require("../controllers/proposalController");

// Debug check — this MUST print functions, not {}
console.log("Loaded proposalController:", proposalController);

// CREATE APPLICATION
router.post(
  "/",
  authMiddleware,
  proposalController.createProposalController
);

// GET APPLICATIONS BY PROJECT
router.get(
  "/project/:projectId",
  authMiddleware,
  proposalController.getProposalsByProjectController
);

module.exports = router;
