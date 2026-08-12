const ApiError = require("../utils/ApiError");

class ApplicationService {
  constructor(applicationRepository, projectRepository) {
    this.applicationRepository = applicationRepository;
    this.projectRepository = projectRepository;
  }

  async applyToProject(user, data) {
    const { projectId, proposal, portfolio_url, bid_amount } = data;

    if (!projectId) {
      throw new ApiError("projectId is required", 400);
    }

    if (user.role !== "freelancer") {
      throw new ApiError("Only freelancers can apply", 403);
    }

    const parsedProjectId = Number(projectId);

    if (Number.isNaN(parsedProjectId)) {
      throw new ApiError("Invalid projectId", 400);
    }

    const project = await this.projectRepository.findById(parsedProjectId);

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    if (project.client_id === user.id && user.role !== "admin") {
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

    let parsedBidAmount = null;
    if (bid_amount !== undefined && bid_amount !== null && bid_amount !== "") {
      parsedBidAmount = Number(bid_amount);

      if (Number.isNaN(parsedBidAmount)) {
        throw new ApiError("bid_amount must be a valid number", 400);
      }
    }

    if (portfolio_url && !/^https?:\/\/.+/i.test(portfolio_url)) {
      throw new ApiError(
        "portfolio_url must be a valid URL starting with http or https",
        400
      );
    }

    const application = await this.applicationRepository.create({
      project_id: parsedProjectId,
      freelancer_id: user.id,
      cover_letter: proposal?.trim() || null,
      bid_amount: parsedBidAmount,
      portfolio_url: portfolio_url?.trim() || null,
      status: "Applied",
    });

    return {
      message: "Applied successfully",
      application,
    };
  }

  async getByProject(user, projectId, queryParams = {}) {
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

    const result = await this.applicationRepository.findByProject(
      parsedProjectId,
      queryParams
    );

    return {
      applications: result.applications || [],
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getByFreelancer(user, queryParams = {}) {
    if (user.role !== "freelancer" && user.role !== "admin") {
      throw new ApiError("Only freelancers can view their applications", 403);
    }

    const result = await this.applicationRepository.findByFreelancer(
      user.id,
      queryParams
    );

    return {
      applications: result.applications || [],
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async withdraw(user, applicationId) {
    const parsedApplicationId = Number(applicationId);

    if (Number.isNaN(parsedApplicationId)) {
      throw new ApiError("Invalid application id", 400);
    }

    const application =
      await this.applicationRepository.findById(parsedApplicationId);

    if (!application) {
      throw new ApiError("Application not found", 404);
    }

    if (application.freelancer_id !== user.id && user.role !== "admin") {
      throw new ApiError("Forbidden", 403);
    }

    await this.applicationRepository.delete(parsedApplicationId);

    return { message: "Application withdrawn" };
  }
}

module.exports = ApplicationService;