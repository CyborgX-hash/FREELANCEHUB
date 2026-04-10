const { prisma } = require("../config/database");

class ApplicationRepository {
  async create(data) {
    return prisma.application.create({
      data,
      include: {
        project: true,
      },
    });
  }

  async findById(id) {
    return prisma.application.findUnique({
      where: { id },
    });
  }

  async findByProject(projectId) {
    return prisma.application.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: "desc" },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            portfolio_url: true,
          },
        },
      },
    });
  }

  async findByFreelancer(freelancerId) {
    return prisma.application.findMany({
      where: { freelancer_id: freelancerId },
      orderBy: { created_at: "desc" },
      include: {
        project: {
          include: {
            client: {
              select: { id: true, name: true, username: true },
            },
          },
        },
      },
    });
  }

  async findByProjectAndFreelancer(projectId, freelancerId) {
    return prisma.application.findFirst({
      where: {
        project_id: projectId,
        freelancer_id: freelancerId,
      },
    });
  }

  async delete(id) {
    return prisma.application.delete({
      where: { id },
    });
  }
}

module.exports = ApplicationRepository;