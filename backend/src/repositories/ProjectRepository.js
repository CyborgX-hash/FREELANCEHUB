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

  buildWhereClause({ search, category, clientId }) {
    const where = {};

    if (clientId) {
      where.client_id = Number(clientId);
    }

    const andConditions = [];

    if (search && search.trim()) {
      const term = search.trim();
      andConditions.push({
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      });
    }

    if (category && category !== "all") {
      const cat = category.trim();
      andConditions.push({
        OR: [
          { category: { equals: cat, mode: "insensitive" } },
          { skills: { contains: cat, mode: "insensitive" } },
        ],
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  getSortOrder(sortBy) {
    switch (sortBy) {
      case "oldest":
        return { created_at: "asc" };
      case "budget-low":
        return { budget_min: "asc" };
      case "budget-high":
        return { budget_min: "desc" };
      case "latest":
      case "newest":
      default:
        return { created_at: "desc" };
    }
  }

  async findAll(options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.max(1, parseInt(options.limit, 10) || 8);
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(options);
    const orderBy = this.getSortOrder(options.sortBy);

    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          client: {
            select: { id: true, name: true, username: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByClient(clientId, options = {}) {
    return this.findAll({ ...options, clientId });
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