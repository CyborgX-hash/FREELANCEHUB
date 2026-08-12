class ApplicationController {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }

  applyToProject = async (req, res) => {
    try {
      const result = await this.applicationService.applyToProject(
        req.user,
        req.body
      );

      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message || "Internal Server Error",
      });
    }
  };

  getByProject = async (req, res) => {
    try {
      const result = await this.applicationService.getByProject(
        req.user,
        req.params.projectId,
        req.query
      );

      return res.json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message,
      });
    }
  };

  getByFreelancer = async (req, res) => {
    try {
      const result = await this.applicationService.getByFreelancer(
        req.user,
        req.query
      );

      return res.json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message,
      });
    }
  };

  withdraw = async (req, res) => {
    try {
      const result = await this.applicationService.withdraw(
        req.user,
        req.params.id
      );

      return res.json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message,
      });
    }
  };
}

module.exports = ApplicationController;