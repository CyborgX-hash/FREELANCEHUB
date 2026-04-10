const database = require("../patterns/DatabaseSingleton");

const prisma = database.getClient();

module.exports = { prisma };