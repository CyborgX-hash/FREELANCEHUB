const { prisma } = require("../config/database");
const { createToken } = require("../utils/auth");
const bcrypt = require("bcrypt");

/* =========================================================
   CREATE USER
========================================================= */
async function createUserController(req, res) {
  let { name, username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize role to match Prisma ENUM
    const prismaRole =
      role?.toLowerCase() === "freelancer" ? "Freelancer" : "Client";

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: prismaRole,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("CreateUser error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error while creating user",
    });
  }
}

/* =========================================================
   LOGIN
========================================================= */
async function loginUserController(req, res) {
  let { email, username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email: email.toLowerCase() } : undefined,
          username ? { username: username.toLowerCase() } : undefined,
        ].filter(Boolean),
      },
    });

    if (!user) {
      return res.status(404).json({ ERROR: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ ERROR: "Invalid credentials" });
    }

    // Normalize role for frontend
    let normalizedRole =
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

    return res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =========================================================
   LOGOUT
========================================================= */
async function logoutUserController(req, res) {
  try {
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ ERROR: "Logout failed" });
  }
}

/* =========================================================
   GET MY PROFILE
========================================================= */
async function getMeController(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,

        // Extended profile fields
        age: true,
        gender: true,
        city: true,
        experience: true,
        organization: true,
        aboutOrg: true,
        skills: true,
        portfolio_url: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ ERROR: "User not found" });

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =========================================================
   UPDATE PROFILE (FULL VERSION)
========================================================= */
async function updateUserController(req, res) {
  try {
    const userId = req.user.id;

    let {
      name,
      username,
      age,
      gender,
      city,
      experience,
      organization,
      aboutOrg,
      skills,
      portfolio_url,
    } = req.body;

    const updateData = {};

    // BASIC
    if (name) updateData.name = name.trim();
    if (username) updateData.username = username.trim().toLowerCase();

    // EXTENDED FIELDS
    if (age) updateData.age = Number(age);
    if (gender) updateData.gender = gender;
    if (city) updateData.city = city;
    if (experience) updateData.experience = Number(experience);
    if (organization) updateData.organization = organization;
    if (aboutOrg) updateData.aboutOrg = aboutOrg;
    if (skills) updateData.skills = skills;
    if (portfolio_url) updateData.portfolio_url = portfolio_url;

    // No fields provided
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ ERROR: "No valid fields provided for update" });
    }

    // Username unique check
    if (updateData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: updateData.username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          ERROR: "Username already taken",
        });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("UpdateUser error:", err);
    return res.status(500).json({
      ERROR: "Internal Server Error while updating user",
    });
  }
}

module.exports = {
  createUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateUserController,
};
