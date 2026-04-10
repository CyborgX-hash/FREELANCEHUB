// src/patterns/UserFactory.js

const Client = require("../models/Client");
const Freelancer = require("../models/Freelancer");

class UserFactory {
  static createUser(role, data) {
    switch (role?.toLowerCase()) {
      case "freelancer":
        return new Freelancer(data);

      case "client":
      default:
        return new Client(data);
    }
  }
}

module.exports = UserFactory;