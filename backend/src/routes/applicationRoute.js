const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const applicationController = require("../controllers/applicationController");

router.post(
  "/apply",
  authMiddleware,
  applicationController.applyToProjectController
);


router.get(
  "/project/:projectId",
  authMiddleware,
  applicationController.getApplicationsByProjectController
);


router.get(
  "/me",
  authMiddleware,
  applicationController.getApplicationsByFreelancerController
);


router.delete(
  "/:id",
  authMiddleware,
  applicationController.withdrawApplicationController
);


module.exports = router;
