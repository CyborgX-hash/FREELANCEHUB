const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/userMiddleware");
const projectController = require("../controllers/projectController");

router.post("/create", authMiddleware, projectController.createProjectController);

router.get("/", projectController.getAllProjectsController);

router.get("/client/:clientId", projectController.getClientProjectsController);

router.get("/:id", projectController.getProjectByIdController);
router.put("/:id", authMiddleware, projectController.updateProjectController);
router.delete("/:id", authMiddleware, projectController.deleteProjectController);

module.exports = router;
