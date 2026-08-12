const ApiError = require("../utils/ApiError");

class ProjectService {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async createProject(user, data) {
    const {
      title,
      description,
      budget_min,
      budget_max,
      skills,
      deadline,
      category,
    } = data;

    if (!title || !description) {
      throw new ApiError("Missing required fields", 400);
    }

    if (user.role !== "client") {
      throw new ApiError("Only clients can create projects", 403);
    }

    const parsedBudgetMin =
      budget_min !== undefined && budget_min !== null && budget_min !== ""
        ? Number(budget_min)
        : null;

    const parsedBudgetMax =
      budget_max !== undefined && budget_max !== null && budget_max !== ""
        ? Number(budget_max)
        : null;

    if (parsedBudgetMin !== null && Number.isNaN(parsedBudgetMin)) {
      throw new ApiError("budget_min must be a valid number", 400);
    }

    if (parsedBudgetMax !== null && Number.isNaN(parsedBudgetMax)) {
      throw new ApiError("budget_max must be a valid number", 400);
    }

    if (
      parsedBudgetMin !== null &&
      parsedBudgetMax !== null &&
      parsedBudgetMin > parsedBudgetMax
    ) {
      throw new ApiError("budget_min cannot be greater than budget_max", 400);
    }

    const parsedDeadline = deadline ? new Date(deadline) : null;

    if (parsedDeadline && Number.isNaN(parsedDeadline.getTime())) {
      throw new ApiError("Invalid deadline value", 400);
    }

    const project = await this.projectRepository.create({
      title: title.trim(),
      description: description.trim(),
      budget_min: parsedBudgetMin,
      budget_max: parsedBudgetMax,
      skills: skills?.trim() || null,
      category: category?.trim() || "General",
      deadline: parsedDeadline,
      client_id: user.id,
    });

    return {
      message: "Project created successfully",
      project,
    };
  }

  async getAllProjects(queryParams = {}) {
    const result = await this.projectRepository.findAll(queryParams);

    const formatted = (result.projects || []).map((p) => ({
      ...p,
      budget:
        p.budget_min !== null && p.budget_max !== null
          ? `₹${p.budget_min} - ₹${p.budget_max}`
          : p.budget_min !== null
          ? `₹${p.budget_min}`
          : p.budget_max !== null
          ? `₹${p.budget_max}`
          : null,
      category: p.category || "General",
    }));

    return {
      projects: formatted,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getProjectById(id) {
    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
      throw new ApiError("Invalid project id", 400);
    }

    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    return { project };
  }

  async getProjectsByClient(user, clientId, queryParams = {}) {
    const parsedClientId = Number(clientId);

    if (Number.isNaN(parsedClientId)) {
      throw new ApiError("Invalid client id", 400);
    }

    if (user.id !== parsedClientId && user.role !== "admin") {
      throw new ApiError("Forbidden", 403);
    }

    const result = await this.projectRepository.findByClient(
      parsedClientId,
      queryParams
    );

    const formatted = (result.projects || []).map((p) => ({
      ...p,
      budget:
        p.budget_min !== null && p.budget_max !== null
          ? `₹${p.budget_min} - ₹${p.budget_max}`
          : p.budget_min !== null
          ? `₹${p.budget_min}`
          : p.budget_max !== null
          ? `₹${p.budget_max}`
          : null,
      category: p.category || "General",
    }));

    return {
      projects: formatted,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async updateProject(user, projectId, data) {
    const parsedProjectId = Number(projectId);

    if (Number.isNaN(parsedProjectId)) {
      throw new ApiError("Invalid project id", 400);
    }

    const existing = await this.projectRepository.findById(parsedProjectId);

    if (!existing) {
      throw new ApiError("Project not found", 404);
    }

    if (existing.client_id !== user.id && user.role !== "admin") {
      throw new ApiError("Forbidden", 403);
    }

    const updateData = {};

    if (data.title !== undefined) {
      if (!String(data.title).trim()) {
        throw new ApiError("Title cannot be empty", 400);
      }
      updateData.title = String(data.title).trim();
    }

    if (data.description !== undefined) {
      if (!String(data.description).trim()) {
        throw new ApiError("Description cannot be empty", 400);
      }
      updateData.description = String(data.description).trim();
    }

    if (data.budget_min !== undefined) {
      if (data.budget_min === null || data.budget_min === "") {
        updateData.budget_min = null;
      } else {
        const parsedBudgetMin = Number(data.budget_min);
        if (Number.isNaN(parsedBudgetMin)) {
          throw new ApiError("budget_min must be a valid number", 400);
        }
        updateData.budget_min = parsedBudgetMin;
      }
    }

    if (data.budget_max !== undefined) {
      if (data.budget_max === null || data.budget_max === "") {
        updateData.budget_max = null;
      } else {
        const parsedBudgetMax = Number(data.budget_max);
        if (Number.isNaN(parsedBudgetMax)) {
          throw new ApiError("budget_max must be a valid number", 400);
        }
        updateData.budget_max = parsedBudgetMax;
      }
    }

    const finalBudgetMin =
      updateData.budget_min !== undefined
        ? updateData.budget_min
        : existing.budget_min;

    const finalBudgetMax =
      updateData.budget_max !== undefined
        ? updateData.budget_max
        : existing.budget_max;

    if (
      finalBudgetMin !== null &&
      finalBudgetMax !== null &&
      finalBudgetMin !== undefined &&
      finalBudgetMax !== undefined &&
      finalBudgetMin > finalBudgetMax
    ) {
      throw new ApiError("budget_min cannot be greater than budget_max", 400);
    }

    if (data.skills !== undefined) {
      updateData.skills = data.skills ? String(data.skills).trim() : null;
    }

    if (data.category !== undefined) {
      updateData.category = data.category
        ? String(data.category).trim()
        : "General";
    }

    if (data.deadline !== undefined) {
      if (data.deadline === null || data.deadline === "") {
        updateData.deadline = null;
      } else {
        const parsedDeadline = new Date(data.deadline);
        if (Number.isNaN(parsedDeadline.getTime())) {
          throw new ApiError("Invalid deadline value", 400);
        }
        updateData.deadline = parsedDeadline;
      }
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const updated = await this.projectRepository.update(
      parsedProjectId,
      updateData
    );

    return {
      message: "Project updated successfully",
      project: updated,
    };
  }

  async deleteProject(user, projectId) {
    const parsedProjectId = Number(projectId);

    if (Number.isNaN(parsedProjectId)) {
      throw new ApiError("Invalid project id", 400);
    }

    const existing = await this.projectRepository.findById(parsedProjectId);

    if (!existing) {
      throw new ApiError("Project not found", 404);
    }

    if (existing.client_id !== user.id && user.role !== "admin") {
      throw new ApiError("Forbidden", 403);
    }

    await this.projectRepository.delete(parsedProjectId);

    return { message: "Project deleted successfully" };
  }
}

module.exports = ProjectService;