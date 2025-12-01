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
   Example: GET /api/applications/project/10
============================================================ */
router.get(
  "/project/:projectId",
  authMiddleware,
  applicationController.getApplicationsByProjectController
);

/* ============================================================
   GET ALL APPLICATIONS OF LOGGED-IN FREELANCER
   Example: GET /api/applications/my
============================================================ */
router.get(
  "/my",
  authMiddleware,
  applicationController.getApplicationsByFreelancerController
);

/* ============================================================
   WITHDRAW APPLICATION (Freelancer)
   Example: DELETE /api/applications/withdraw/5
============================================================ */
router.delete(
  "/withdraw/:id",
  authMiddleware,
  applicationController.withdrawApplicationController
);

module.exports = router;
