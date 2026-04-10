const { prisma } = require("../config/database");

class ProjectRepository {
  async create(data) {
    return prisma.project.create({
      data,
    });
  }

  async findById(id) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, username: true },
        },
      },
    });
  }

  async findAll() {
    return prisma.project.findMany({
      orderBy: { created_at: "desc" },
      include: {
        client: {
          select: { id: true, name: true, username: true },
        },
      },
    });
  }

  async findByClient(clientId) {
    return prisma.project.findMany({
      where: { client_id: clientId },
      orderBy: { created_at: "desc" },
    });
  }

  async update(id, data) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.project.delete({
      where: { id },
    });
  }
}

module.exports = ProjectRepository;