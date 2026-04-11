const ApiError = require("../utils/ApiError");

class ProposalService {
  constructor(applicationRepository, projectRepository) {
    this.applicationRepository = applicationRepository;
    this.projectRepository = projectRepository;
  }

  async createProposal(user, data) {
    const { project_id, cover_letter, portfolio_url } = data;

    if (!project_id) {
      throw new ApiError("project_id is required", 400);
    }

    if (user.role !== "freelancer") {
      throw new ApiError("Only freelancers can submit proposals", 403);
    }

    const parsedProjectId = Number(project_id);

    if (Number.isNaN(parsedProjectId)) {
      throw new ApiError("Invalid project_id", 400);
    }

    const project = await this.projectRepository.findById(parsedProjectId);

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    if (project.client_id === user.id) {
      throw new ApiError("Cannot apply to your own project", 403);
    }

    const existing =
      await this.applicationRepository.findByProjectAndFreelancer(
        parsedProjectId,
        user.id
      );

    if (existing) {
      throw new ApiError("Already applied to this project", 400);
    }

    if (portfolio_url && !/^https?:\/\/.+/i.test(portfolio_url)) {
      throw new ApiError(
        "portfolio_url must be a valid URL starting with http or https",
        400
      );
    }

    const proposal = await this.applicationRepository.create({
      project_id: parsedProjectId,
      freelancer_id: user.id,
      cover_letter: cover_letter?.trim() || null,
      portfolio_url: portfolio_url?.trim() || null,
      status: "Applied",
    });

    return {
      message: "Proposal submitted successfully",
      proposal,
    };
  }

  async getByProject(user, projectId) {
    const parsedProjectId = Number(projectId);

    if (Number.isNaN(parsedProjectId)) {
      throw new ApiError("Invalid project id", 400);
    }

    const project = await this.projectRepository.findById(parsedProjectId);

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    if (project.client_id !== user.id && user.role !== "admin") {
      throw new ApiError("Forbidden", 403);
    }

    const proposals =
      await this.applicationRepository.findByProject(parsedProjectId);

    return { proposals };
  }
}

module.exports = ProposalService;