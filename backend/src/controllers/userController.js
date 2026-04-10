class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  register = async (req, res) => {
    try {
      const result = await this.userService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message,
      });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.userService.login(req.body);
      return res.json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message,
      });
    }
  };

  getMe = async (req, res) => {
    try {
      const result = await this.userService.getMe(req.user.id);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ ERROR: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const result = await this.userService.update(
        req.user.id,
        req.body
      );
      return res.json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ERROR: error.message,
      });
    }
  };

  logout = async (req, res) => {
    return res.json({ message: "Logout successful" });
  };
}

module.exports = UserController;