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

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project)
      return res.status(404).json({ ERROR: "Project not found" });

    // Role validation
    if (freelancer.role.toLowerCase() !== "freelancer") {
      return res
        .status(403)
        .json({ ERROR: "Only freelancers can apply to projects" });
    }

    // Freelancer cannot apply to own project
    if (project.client_id === freelancer.id) {
      return res
        .status(403)
        .json({ ERROR: "You cannot apply to your own project" });
    }

    // Prevent duplicate application
    const existing = await prisma.application.findFirst({
      where: {
        project_id: Number(projectId),
        freelancer_id: freelancer.id,
      },
    });

    if (existing)
      return res
        .status(400)
        .json({ ERROR: "You already applied to this project" });

    // Create application
    const application = await prisma.application.create({
      data: {
        project_id: Number(projectId),
        freelancer_id: freelancer.id,
        cover_letter: proposal || null,
        bid_amount: bid_amount ? Number(bid_amount) : null,
      },
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

    return res
      .status(201)
      .json({ message: "Applied successfully", application });
  } catch (err) {
    console.error("Apply error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error",
      details: err.message,
    });
  }
}

/* ============================================================
   CLIENT → GET FREELANCERS APPLIED TO A PROJECT
============================================================ */
async function getApplicationsByProjectController(req, res) {
  try {
    const { projectId } = req.params;
    const user = req.user;

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project)
      return res.status(404).json({ ERROR: "Project not found" });

    // Only owner client or Admin can view applicants
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

    return res.json({ applications });
  } catch (err) {
    console.error("Fetch applicants error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================================
   FREELANCER → VIEW THEIR OWN APPLICATIONS
============================================================ */
async function getApplicationsByFreelancerController(req, res) {
  try {
    const freelancer = req.user;

    const applications = await prisma.application.findMany({
      where: { freelancer_id: freelancer.id },
      orderBy: { created_at: "desc" },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return res.json({ applications });
  } catch (err) {
    console.error("Fetch my applications error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* ============================================================
   FREELANCER → WITHDRAW THEIR APPLICATION
============================================================ */
async function withdrawApplicationController(req, res) {
  try {
    const freelancer = req.user;
    const { id } = req.params; // application ID

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

    return res.json({ message: "Application withdrawn" });
  } catch (err) {
    console.error("Withdraw error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

module.exports = {
  applyToProjectController,
  getApplicationsByProjectController,
  getApplicationsByFreelancerController,
  withdrawApplicationController,
};
