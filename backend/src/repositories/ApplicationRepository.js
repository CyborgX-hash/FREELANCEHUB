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

  getSortOrder(sortBy) {
    switch (sortBy) {
      case "oldest":
        return { created_at: "asc" };
      case "bid-low":
        return { bid_amount: "asc" };
      case "bid-high":
        return { bid_amount: "desc" };
      case "latest":
      case "newest":
      default:
        return { created_at: "desc" };
    }
  }

  async findByProject(projectId, options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.max(1, parseInt(options.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const where = { project_id: Number(projectId) };

    const andConditions = [];
    if (options.search && options.search.trim()) {
      const term = options.search.trim();
      andConditions.push({
        OR: [
          { freelancer: { name: { contains: term, mode: "insensitive" } } },
          { freelancer: { email: { contains: term, mode: "insensitive" } } },
          { cover_letter: { contains: term, mode: "insensitive" } },
        ],
      });
    }

    if (options.status && options.status !== "all") {
      andConditions.push({ status: { equals: options.status, mode: "insensitive" } });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const orderBy = this.getSortOrder(options.sortBy);

    const [applications, total] = await prisma.$transaction([
      prisma.application.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByFreelancer(freelancerId, options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.max(1, parseInt(options.limit, 10) || 6);
    const skip = (page - 1) * limit;

    const where = { freelancer_id: Number(freelancerId) };

    const andConditions = [];
    if (options.search && options.search.trim()) {
      const term = options.search.trim();
      andConditions.push({
        OR: [
          { project: { title: { contains: term, mode: "insensitive" } } },
          { cover_letter: { contains: term, mode: "insensitive" } },
        ],
      });
    }

    if (options.status && options.status !== "all") {
      andConditions.push({ status: { equals: options.status, mode: "insensitive" } });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const orderBy = this.getSortOrder(options.sortBy);

    const [applications, total] = await prisma.$transaction([
      prisma.application.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          project: {
            include: {
              client: {
                select: { id: true, name: true, username: true },
              },
            },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
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