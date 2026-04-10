const { PrismaClient } = require("@prisma/client");

class DatabaseSingleton {
  static instance;

  constructor() {
    if (DatabaseSingleton.instance) {
      return DatabaseSingleton.instance;
    }

    this.prisma = new PrismaClient();

    DatabaseSingleton.instance = this;
  }

  getClient() {
    return this.prisma;
  }
}

module.exports = new DatabaseSingleton();