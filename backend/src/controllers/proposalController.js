class ProposalController {
  constructor(proposalService) {
    this.proposalService = proposalService;
  }

  create = async (req, res) => {
    try {
      const result = await this.proposalService.createProposal(
        req.user,
        req.body
      );

      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message,
      });
    }
  };

  getByProject = async (req, res) => {
    try {
      const result = await this.proposalService.getByProject(
        req.params.projectId
      );

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        ERROR: error.message,
      });
    }
  };
}

module.exports = ProposalController;