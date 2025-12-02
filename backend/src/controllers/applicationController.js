const { prisma } = require("../config/database");

/* ============================================================
   FREELANCER → APPLY TO PROJECT
============================================================ */
async function applyToProjectController(req, res) {
  try {
    const freelancer = req.user;
    const { projectId, proposal, bid_amount } = req.body;

    if (!projectId)
      return res.status(400).json({ ERROR: "projectId is required" });

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project)
      return res.status(404).json({ ERROR: "Project not found" });

    if (freelancer.role.toLowerCase() !== "freelancer") {
      return res.status(403).json({ ERROR: "Only freelancers can apply" });
    }

    if (project.client_id === freelancer.id) {
      return res.status(403).json({ ERROR: "Cannot apply to your own project" });
    }

    // prevent duplicate Application
    const existing = await prisma.application.findFirst({
      where: {
        project_id: Number(projectId),
        freelancer_id: freelancer.id,
      },
    });

    if (existing)
      return res.status(400).json({ ERROR: "Already applied to this project" });

    const application = await prisma.application.create({
      data: {
        project_id: Number(projectId),
        freelancer_id: freelancer.id,
        cover_letter: proposal || null,
        bid_amount: bid_amount ? Number(bid_amount) : null,
        status: "Applied",
      },
      include: {
        project: true,
      },
    });

    return res.json({ message: "Applied successfully", application });
  } catch (err) {
    console.error("Apply error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================================
   CLIENT → SEE APPLICANTS
============================================================ */
async function getApplicationsByProjectController(req, res) {
  try {
    const user = req.user;
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project)
      return res.status(404).json({ ERROR: "Project not found" });

    if (project.client_id !== user.id && user.role !== "Admin") {
      return res.status(403).json({ ERROR: "Forbidden" });
    }

    const applications = await prisma.application.findMany({
      where: { project_id: Number(projectId) },
      orderBy: { created_at: "desc" },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    res.json({ applications });
  } catch (err) {
    console.error("Applicants fetch error:", err);
    res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================================
   FREELANCER → VIEW OWN APPLICATIONS
============================================================ */
async function getApplicationsByFreelancerController(req, res) {
  try {
    const freelancer = req.user;

    const apps = await prisma.application.findMany({
      where: { freelancer_id: freelancer.id },
      orderBy: { created_at: "desc" },
      include: {
        project: {
          include: {
            client: {
              select: { id: true, name: true, username: true },
            },
          },
        },
      },
    });

    res.json({ applications: apps });
  } catch (err) {
    console.error("My applications fetch error:", err);
    res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================================
   FREELANCER → WITHDRAW APPLICATION
============================================================ */
async function withdrawApplicationController(req, res) {
  try {
    const freelancer = req.user;
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
    });

    if (!application)
      return res.status(404).json({ ERROR: "Application not found" });

    if (application.freelancer_id !== freelancer.id) {
      return res.status(403).json({ ERROR: "Forbidden" });
    }

    await prisma.application.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Application withdrawn" });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

module.exports = {
  applyToProjectController,
  getApplicationsByProjectController,
  getApplicationsByFreelancerController,
  withdrawApplicationController,
};
