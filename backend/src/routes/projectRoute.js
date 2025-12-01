const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/userMiddleware"); // use existing middleware that sets req.user

const projectController = require("../controllers/projectController");

router.post("/create", projectController.createProjectController);
router.get("/client/:clientId", projectController.getClientProjectsController);
router.get("/", projectController.getAllProjectsController);
router.get("/:id", projectController.getProjectByIdController);
router.put("/:id", authMiddleware, projectController.updateProjectController);
router.delete("/:id", authMiddleware, projectController.deleteProjectController);

module.exports = router;
