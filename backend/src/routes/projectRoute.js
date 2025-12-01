const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const projectController = require("../controllers/projectController");

router.post("/create", authMiddleware, projectController.createProjectController);

// GET all public projects for browsing (freelancers)
router.get("/", projectController.getAllProjectsController);

// GET logged-in client projects
router.get("/client/:clientId", projectController.getClientProjectsController);

router.get("/:id", projectController.getProjectByIdController);
router.put("/:id", authMiddleware, projectController.updateProjectController);
router.delete("/:id", authMiddleware, projectController.deleteProjectController);

module.exports = router;
