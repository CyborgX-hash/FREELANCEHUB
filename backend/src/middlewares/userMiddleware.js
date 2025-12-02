const jwt = require("jsonwebtoken");
const { prisma } = require("../config/database");

/* ============================================================
   CREATE USER VALIDATION
============================================================ */
async function createUserMiddleware(req, res, next) {
    let { name, username, email, password, confirm_password, role } = req.body;

    if (!name || !username || !email || !password || !confirm_password) {
        return res.status(400).json({ ERROR: "All fields are required" });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();

    if (password !== confirm_password) {
        return res.status(400).json({ ERROR: "Passwords do not match" });
    }

    if (password.length < 8) {
        return res.status(400).json({ ERROR: "Password must be at least 8 characters long" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ERROR: "Invalid email format" });
    }

    if (username.length < 3) {
        return res.status(400).json({ ERROR: "Username must be at least 3 characters long" });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ ERROR: "Username may only contain letters, numbers, underscores" });
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ ERROR: "Name should contain only letters & spaces" });
    }

    if (!role) role = "Client";

    try {
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });

        if (existingUser) {
            return res.status(400).json({ ERROR: "Email or Username already exists" });
        }

        req.body = { name, username, email, password, role };
        next();
    } catch (err) {
        console.error("CreateUser Middleware Error:", err);
        return res.status(500).json({ ERROR: "Server validation error" });
    }
}

/* ============================================================
   LOGIN VALIDATION
============================================================ */
async function loginUserMiddleware(req, res, next) {
    let { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        return res.status(400).json({
            ERROR: "Email/Username and Password are required",
        });
    }

    if (email) email = email.trim().toLowerCase();
    if (username) username = username.trim().toLowerCase();

    req.body = { email, username, password };
    next();
}

/* ============================================================
   LOGOUT VALIDATION  (RESTORED)
============================================================ */
async function logoutUserMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ ERROR: "No token provided" });
    }

    next();
}

/* ============================================================
   AUTH MIDDLEWARE (CRITICAL)
============================================================ */
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ ERROR: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) return res.status(401).json({ ERROR: "Unauthorized: User not found" });

        req.user = user;

        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ ERROR: "Invalid or expired token" });
    }
}

/* ============================================================
   UPDATE USER PROFILE VALIDATION
============================================================ */
async function updateUserMiddleware(req, res, next) {
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
        email,
        password,
        role,
    } = req.body;

    if (email || password || role) {
        return res.status(400).json({
            ERROR: "Email, password, and role cannot be updated.",
        });
    }

    if (
        !name &&
        !username &&
        !age &&
        !gender &&
        !city &&
        !experience &&
        !organization &&
        !aboutOrg &&
        !skills &&
        !portfolio_url
    ) {
        return res.status(400).json({
            ERROR: "Provide at least one field to update.",
        });
    }

    if (name) {
        name = name.trim();
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return res.status(400).json({ ERROR: "Name must contain only letters & spaces" });
        }
    }

    if (username) {
        username = username.trim().toLowerCase();
        if (username.length < 3) {
            return res.status(400).json({ ERROR: "Username must be at least 3 characters long" });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({
                ERROR: "Username may only contain letters, numbers, underscores",
            });
        }
    }

    if (age && isNaN(Number(age))) {
        return res.status(400).json({ ERROR: "Age must be a number" });
    }

    if (experience && isNaN(Number(experience))) {
        return res.status(400).json({ ERROR: "Experience must be a number" });
    }

    req.body = {
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
    };

    next();
}

module.exports = {
    createUserMiddleware,
    loginUserMiddleware,
    logoutUserMiddleware, 
    updateUserMiddleware,
    authMiddleware,
};
