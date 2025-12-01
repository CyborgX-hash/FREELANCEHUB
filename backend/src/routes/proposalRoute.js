const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/userMiddleware");
const proposalController = require("../controllers/proposalController");

router.post("/", authMiddleware, proposalController.createProposalController);
router.get("/project/:projectId", authMiddleware, proposalController.getProposalsByProjectController);
router.get("/freelancer/:freelancerId", authMiddleware, proposalController.getProposalsByFreelancerController);

module.exports = router;

