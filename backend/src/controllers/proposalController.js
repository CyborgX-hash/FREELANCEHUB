const { prisma } = require("../config/database");

/* =====================================================
   CREATE APPLICATION
===================================================== */
async function createProposalController(req, res) {
  try {
    const { project_id, freelancer_id, cover_letter, portfolio_url } = req.body;

    if (!project_id || !freelancer_id)
      return res.status(400).json({ ERROR: "Missing required fields" });

    const application = await prisma.application.create({
      data: {
        project_id: Number(project_id),
        freelancer_id: Number(freelancer_id),
        cover_letter,
        portfolio_url: portfolio_url || null,
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Create Application Error:", err);
    return res.status(500).json({ ERROR: err.message });
  }
}

/* =====================================================
   GET APPLICATIONS BY PROJECT ID
===================================================== */
async function getProposalsByProjectController(req, res) {
  try {
    const { projectId } = req.params;

    const applications = await prisma.application.findMany({
      where: { project_id: Number(projectId) },
      orderBy: { created_at: "desc" },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            portfolio_url: true,
          },
        },
      },
    });

    console.log("DEBUG: APPLICATIONS RETURNED = ", applications);

    return res.json({ applications });
  } catch (err) {
    console.error("Fetch Applications Error:", err);
    return res.status(500).json({ ERROR: err.message });
  }
}

/* =====================================================
   EXPORT FUNCTIONS CORRECTLY
===================================================== */
module.exports = {
  createProposalController,
  getProposalsByProjectController,
};
