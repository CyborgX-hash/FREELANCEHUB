const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const applicationController = require("../controllers/applicationController");

/* ============================================================
   APPLY TO A PROJECT (Freelancer)
============================================================ */
router.post(
  "/apply",
  authMiddleware,
  applicationController.applyToProjectController
);

/* ============================================================
   GET ALL APPLICATIONS FOR A PROJECT (Client)
   GET /api/applications/project/:projectId
============================================================ */
router.get(
  "/project/:projectId",
  authMiddleware,
  applicationController.getApplicationsByProjectController
);

/* ============================================================
   GET ALL APPLICATIONS OF LOGGED-IN FREELANCER
   GET /api/applications/me
============================================================ */
router.get(
  "/me",
  authMiddleware,
  applicationController.getApplicationsByFreelancerController
);

/* ============================================================
   WITHDRAW an Application
   DELETE /api/applications/:id
============================================================ */
router.delete(
  "/:id",
  authMiddleware,
  applicationController.withdrawApplicationController
);

module.exports = router;
