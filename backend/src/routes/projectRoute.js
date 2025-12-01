const express = require("express");
const router = express.Router();

const {
  createProjectController,
  getClientProjectsController
} = require("../controllers/projectController");

router.post("/create", createProjectController);
router.get("/client/:clientId", getClientProjectsController);

module.exports = router;
