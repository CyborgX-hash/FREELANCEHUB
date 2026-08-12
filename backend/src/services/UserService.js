const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const { createToken } = require("../utils/auth");
const UserFactory = require("../patterns/UserFactory");
const brevoEmailService = require("./BrevoEmailService");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async sendOtp(data) {
    const { name, username, email, password, role } = data;

    if (!name || !username || !email || !password || !role) {
      throw new ApiError("All fields including role are required to request OTP", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    const existingEmail = await this.userRepository.findByEmail(cleanEmail);
    if (existingEmail) {
      throw new ApiError("Email already registered", 400);
    }

    const existingUsername = await this.userRepository.findByUsername(cleanUsername);
    if (existingUsername) {
      throw new ApiError("Username already taken", 400);
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.userRepository.upsertOtp(cleanEmail, otpCode, expiresAt);

    await brevoEmailService.sendOtpEmail({
      recipientEmail: cleanEmail,
      recipientName: name.trim(),
      otpCode,
    });

    return {
      message: `Verification code sent to ${cleanEmail}`,
    };
  }

  async register(data) {
    const { name, username, email, password, role, otpCode } = data;

    if (!name || !username || !email || !password || !role) {
      throw new ApiError("Missing required registration fields", 400);
    }

    if (!otpCode || !String(otpCode).trim()) {
      throw new ApiError("Email verification code (OTP) is required", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    // Verify OTP in DB
    const otpRecord = await this.userRepository.findOtpByEmail(cleanEmail);

    if (!otpRecord || otpRecord.code !== String(otpCode).trim()) {
      throw new ApiError("Invalid verification code. Please check your email and try again.", 400);
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      throw new ApiError("Verification code has expired. Please request a new code.", 400);
    }

    const existingEmail = await this.userRepository.findByEmail(cleanEmail);
    if (existingEmail) {
      throw new ApiError("Email already registered", 400);
    }

    const existingUsername = await this.userRepository.findByUsername(cleanUsername);
    if (existingUsername) {
      throw new ApiError("Username already taken", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = UserFactory.createUser(role, {
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    const user = await this.userRepository.create(userObject);

    // Clean up OTP record
    await this.userRepository.deleteOtpByEmail(cleanEmail);

    const normalizedRole =
      user.role === "Freelancer"
        ? "freelancer"
        : user.role === "Admin"
        ? "admin"
        : "client";

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: normalizedRole,
    };

    const token = createToken(payload);

    return {
      message: "User registered successfully",
      token,
      user: payload,
    };
  }

  async login(data) {
    const { email, username, password } = data;

    if (!password) {
      throw new ApiError("Password is required", 400);
    }

    const user = await this.userRepository.findByEmailOrUsername({
      email: email?.toLowerCase(),
      username: username?.toLowerCase(),
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError("Invalid credentials", 401);
    }

    const normalizedRole =
      user.role === "Freelancer"
        ? "freelancer"
        : user.role === "Admin"
        ? "admin"
        : "client";

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: normalizedRole,
    };

    const token = createToken(payload);

    return {
      message: "Login successful",
      token,
      user: payload,
    };
  }

  async getMe(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const normalizedRole =
      user.role === "Freelancer"
        ? "freelancer"
        : user.role === "Admin"
        ? "admin"
        : "client";

    return {
      message: "User fetched successfully",
      user: {
        ...user,
        role: normalizedRole,
      },
    };
  }

  async update(userId, data) {
    const updateData = {};

    if (data.name) updateData.name = data.name.trim();
    if (data.username)
      updateData.username = data.username.trim().toLowerCase();
    if (data.age) updateData.age = Number(data.age);
    if (data.gender) updateData.gender = data.gender;
    if (data.city) updateData.city = data.city;
    if (data.experience)
      updateData.experience = Number(data.experience);
    if (data.organization) updateData.organization = data.organization;
    if (data.aboutOrg) updateData.aboutOrg = data.aboutOrg;
    if (data.skills) updateData.skills = data.skills;
    if (data.portfolio_url)
      updateData.portfolio_url = data.portfolio_url;

    if (Object.keys(updateData).length === 0) {
      throw new ApiError("No valid fields provided for update", 400);
    }

    if (updateData.username) {
      const existing =
        await this.userRepository.findByUsername(updateData.username);

      if (existing && existing.id !== userId) {
        throw new ApiError("Username already taken", 400);
      }
    }

    const updatedUser = await this.userRepository.update(
      userId,
      updateData
    );

    return {
      message: "Profile updated successfully",
      user: updatedUser,
    };
  }
}

module.exports = UserService;