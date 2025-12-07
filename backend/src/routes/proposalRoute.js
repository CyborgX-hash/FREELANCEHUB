const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const proposalController = require("../controllers/proposalController");

console.log("Loaded proposalController:", proposalController);

router.post(
  "/",
  authMiddleware,
  proposalController.createProposalController
);

router.get(
  "/project/:projectId",
  authMiddleware,
  proposalController.getProposalsByProjectController
);

module.exports = router;
