import express from "express";
import { createProject, getProjectsByClient } from "../controllers/projectController.js";

const router = express.Router();

router.post("/create", createProject);
router.get("/client/:clientId", getProjectsByClient);

export default router;
