class ProjectController {
  constructor(projectService) {
    this.projectService = projectService;
  }

  create = async (req, res) => {
    try {
      const result = await this.projectService.createProject(
        req.user,
        req.body
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  getAll = async (req, res) => {
    try {
      const result = await this.projectService.getAllProjects();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  getById = async (req, res) => {
    try {
      const result = await this.projectService.getProjectById(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  getByClient = async (req, res) => {
    try {
      const result = await this.projectService.getProjectsByClient(
        req.user,
        req.params.clientId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  update = async (req, res) => {
    try {
      const result = await this.projectService.updateProject(
        req.user,
        req.params.id,
        req.body
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };

  delete = async (req, res) => {
    try {
      const result = await this.projectService.deleteProject(
        req.user,
        req.params.id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal server error",
      });
    }
  };
}

module.exports = ProjectController;