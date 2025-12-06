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

    // Map frontend role → Prisma ENUM
    const prismaRole =
      role?.toLowerCase() === "freelancer"
        ? "Freelancer"
        : role?.toLowerCase() === "admin"
        ? "Admin"
        : "Client";

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

    // Normalize ENUM → frontend role
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
async function logoutUserController(_req, res) {
  try {
    // JWT logout is usually handled on client by deleting token
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

    // Normalize Prisma ENUM → lowercase role for frontend
    const normalizedRole =
      user.role === "Freelancer"
        ? "freelancer"
        : user.role === "Admin"
        ? "admin"
        : "client";

    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        ...user,
        role: normalizedRole,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ ERROR: "Internal Server Error" });
  }
}

/* =========================================================
   UPDATE PROFILE
   (Email / password / role are NOT updatable here)
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

    // BASIC (email/password/role are intentionally NOT included)
    if (name !== undefined) updateData.name = name.trim();
    if (username !== undefined) updateData.username = username.trim().toLowerCase();

    // EXTENDED FIELDS
    if (age !== undefined)
      updateData.age = age === "" || age === null ? null : Number(age);

    if (gender !== undefined) updateData.gender = gender || null;
    if (city !== undefined) updateData.city = city || null;

    if (experience !== undefined)
      updateData.experience =
        experience === "" || experience === null ? null : Number(experience);

    if (organization !== undefined)
      updateData.organization = organization || null;

    if (aboutOrg !== undefined) updateData.aboutOrg = aboutOrg || null;
    if (skills !== undefined) updateData.skills = skills || null;
    if (portfolio_url !== undefined)
      updateData.portfolio_url = portfolio_url || null;

    // No fields provided
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ ERROR: "No valid fields provided for update" });
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

    // Normalize role back to lowercase for frontend
    const normalizedRole =
      updatedUser.role === "Freelancer"
        ? "freelancer"
        : updatedUser.role === "Admin"
        ? "admin"
        : "client";

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        role: normalizedRole,
      },
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
  logoutUserController,   // ✅ added back here
  getMeController,
  updateUserController,
};
