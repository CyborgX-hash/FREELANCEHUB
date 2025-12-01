const { prisma } = require("../config/database");

async function createProposalController(req, res) {
  try {
    const { project_id, freelancer_id, cover_letter, bid } = req.body;
    if (!project_id || !freelancer_id) return res.status(400).json({ ERROR: "Missing fields" });

    // ensure project exists and is open
    const project = await prisma.project.findUnique({ where: { id: Number(project_id) } });
    if (!project) return res.status(404).json({ ERROR: "Project not found" });

    const proposal = await prisma.proposal.create({
      data: {
        project_id: Number(project_id),
        freelancer_id: Number(freelancer_id),
        cover_letter: cover_letter || null,
        bid: bid ? Number(bid) : null,
      },
    });
    return res.status(201).json({ message: "Proposal submitted", proposal });
  } catch (err) {
    console.error("Create proposal error:", err);
    return res.status(500).json({ ERROR: err.message });
  }
}

async function getProposalsByProjectController(req, res) {
  try {
    const { projectId } = req.params;
    const proposals = await prisma.proposal.findMany({
      where: { project_id: Number(projectId) },
      orderBy: { created_at: "desc" },
      include: { freelancer: { select: { id: true, name: true, username: true, skills: true, portfolio_url: true } } },
    });
    return res.json({ proposals });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: err.message });
  }
}

async function getProposalsByFreelancerController(req, res) {
  try {
    const { freelancerId } = req.params;
    const proposals = await prisma.proposal.findMany({
      where: { freelancer_id: Number(freelancerId) },
      orderBy: { created_at: "desc" },
      include: { project: true },
    });
    return res.json({ proposals });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ERROR: err.message });
  }
}

module.exports = {
  createProposalController,
  getProposalsByProjectController,
  getProposalsByFreelancerController,
};
