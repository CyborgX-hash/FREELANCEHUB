const { prisma } = require("../config/database");

/* ============================================
   CREATE PROJECT (Client)
============================================ */
async function createProjectController(req, res) {
  try {
    const {
      title,
      description,
      budget_min,
      budget_max,
      skills,
      deadline,
      client_id
    } = req.body;

    if (!title || !description || !client_id) {
      return res.status(400).json({ ERROR: "Missing required fields" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget_min: budget_min ? Number(budget_min) : null,
        budget_max: budget_max ? Number(budget_max) : null,
        skills: skills || null,
        deadline: deadline ? new Date(deadline) : null,
        client_id: Number(client_id)
      }
    });

    return res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error",
      details: err.message
    });
  }
}

/* ============================================
   GET ALL PROJECTS OF A CLIENT
============================================ */
async function getClientProjectsController(req, res) {
  try {
    const { clientId } = req.params;

    const projects = await prisma.project.findMany({
      where: { client_id: Number(clientId) },
      orderBy: { created_at: "desc" }
    });

    return res.json({ projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   GET ALL PUBLIC PROJECTS (BROWSE JOBS)
============================================ */
async function getAllProjectsController(req, res) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
      include: {
        client: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    // Format for frontend
    const formatted = projects.map((p) => ({
      ...p,
      budget:
        p.budget_min && p.budget_max
          ? `₹${p.budget_min} - ₹${p.budget_max}`
          : p.budget_min
          ? `₹${p.budget_min}`
          : p.budget_max
          ? `₹${p.budget_max}`
          : null,

      category: p.skills || "General"
    }));

    return res.json({ projects: formatted });
  } catch (err) {
    console.error("Get all projects error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   GET SINGLE PROJECT BY ID
============================================ */
async function getProjectByIdController(req, res) {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        client: { select: { id: true, name: true, username: true } }
      }
    });

    if (!project)
      return res.status(404).json({ ERROR: "Project not found" });

    return res.json({ project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================
   UPDATE PROJECT
============================================ */
async function updateProjectController(req, res) {
  try {
    const { id } = req.params;
    const tokenUser = req.user;

    const existing = await prisma.project.findUnique({
      where: { id: Number(id) }
    });

    if (!existing)
      return res.status(404).json({ ERROR: "Project not found" });

    if (existing.client_id !== tokenUser.id)
      return res.status(403).json({ ERROR: "Forbidden" });

    const {
      title,
      description,
      budget_min,
      budget_max,
      skills,
      deadline,
      status
    } = req.body;

    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        budget_min: budget_min ? Number(budget_min) : null,
        budget_max: budget_max ? Number(budget_max) : null,
        skills,
        deadline: deadline ? new Date(deadline) : null,
        status
      }
    });

    return res.json({ message: "Project updated", project: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: err.message });
  }
}

/* ============================================
   DELETE PROJECT
============================================ */
async function deleteProjectController(req, res) {
  try {
    const { id } = req.params;
    const tokenUser = req.user;

    const existing = await prisma.project.findUnique({
      where: { id: Number(id) }
    });

    if (!existing)
      return res.status(404).json({ ERROR: "Project not found" });

    if (existing.client_id !== tokenUser.id)
      return res.status(403).json({ ERROR: "Forbidden" });

    await prisma.project.delete({
      where: { id: Number(id) }
    });

    return res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: err.message });
  }
}

module.exports = {
  createProjectController,
  getClientProjectsController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController
};
