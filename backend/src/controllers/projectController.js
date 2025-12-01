const { prisma } = require("../config/database");

// create project (already similar)
async function createProjectController(req, res) {
  try {
    const { title, description, budget, category, visibility, client_id } = req.body;
    if (!title || !description || !client_id) {
      return res.status(400).json({ ERROR: "Missing required fields" });
    }
    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget: budget ? Number(budget) : null,
        category: category || null,
        visibility: visibility || "public",
        client_id: Number(client_id),
      },
    });
    return res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error", details: err.message });
  }
}

async function getClientProjectsController(req, res) {
  try {
    const { clientId } = req.params;
    const projects = await prisma.project.findMany({
      where: { client_id: Number(clientId) },
      orderBy: { created_at: "desc" },
    });
    return res.json({ projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

async function getAllProjectsController(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: { visibility: "public" },
      orderBy: { created_at: "desc" },
      include: { client: { select: { id: true, name: true, username: true } } },
    });
    return res.json({ projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

async function getProjectByIdController(req, res) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { client: { select: { id: true, name: true, username: true } } },
    });
    if (!project) return res.status(404).json({ ERROR: "Project not found" });
    return res.json({ project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

async function updateProjectController(req, res) {
  try {
    const { id } = req.params;
    const tokenUser = req.user; // requires your auth middleware to set req.user
    const existing = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ ERROR: "Not found" });
    if (existing.client_id !== tokenUser.id) return res.status(403).json({ ERROR: "Forbidden" });

    const { title, description, budget, category, visibility, status } = req.body;
    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        budget: budget ? Number(budget) : null,
        category,
        visibility,
        status,
      },
    });
    return res.json({ message: "Project updated", project: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: err.message });
  }
}

async function deleteProjectController(req, res) {
  try {
    const { id } = req.params;
    const tokenUser = req.user;
    const existing = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ ERROR: "Not found" });
    if (existing.client_id !== tokenUser.id) return res.status(403).json({ ERROR: "Forbidden" });

    await prisma.project.delete({ where: { id: Number(id) } });
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
  deleteProjectController,
};
