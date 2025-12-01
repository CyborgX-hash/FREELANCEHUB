const express = require("express");
const router = express.Router();

const {
  authMiddleware
} = require("../middlewares/userMiddleware");

const projectController = require("../controllers/projectController");

// PUBLIC ROUTES
router.post("/create", projectController.createProjectController);
router.get("/client/:clientId", projectController.getClientProjectsController);
router.get("/", projectController.getAllProjectsController);
router.get("/:id", projectController.getProjectByIdController);

// PROTECTED ROUTES
router.put("/:id", authMiddleware, projectController.updateProjectController);
router.delete("/:id", authMiddleware, projectController.deleteProjectController);

module.exports = router;
