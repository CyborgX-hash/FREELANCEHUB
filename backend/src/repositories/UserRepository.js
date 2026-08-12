const { prisma } = require("../config/database");

class UserRepository {
  async create(data) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmailOrUsername({ email, username }) {
    return prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          username ? { username } : undefined,
        ].filter(Boolean),
      },
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        age: true,
        gender: true,
        city: true,
        experience: true,
        organization: true,
        aboutOrg: true,
        skills: true,
        portfolio_url: true,
        updatedAt: true,
      },
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id },
    });
  }

  // ─── OTP Methods ───
  async upsertOtp(email, code, expiresAt) {
    return prisma.otp.upsert({
      where: { email: email.toLowerCase() },
      update: {
        code,
        expires_at: expiresAt,
      },
      create: {
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt,
      },
    });
  }

  async findOtpByEmail(email) {
    return prisma.otp.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async deleteOtpByEmail(email) {
    return prisma.otp.deleteMany({
      where: { email: email.toLowerCase() },
    });
  }
}

module.exports = UserRepository;