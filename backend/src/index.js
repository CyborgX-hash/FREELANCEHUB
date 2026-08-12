require("dotenv").config();
const express = require("express");
const http = require("http");

const corsMiddleware = require("./config/cors");
const { setupSocket } = require("./config/socket");

const userRoutes = require("./routes/userRoute");
const projectRoutes = require("./routes/projectRoute");
const proposalRoutes = require("./routes/proposalRoute");
const applicationRoutes = require("./routes/applicationRoute");
const chatRoutes = require("./routes/chatRoute");

const errorHandler = require("./middlewares/errorMiddleware");

const app = express();
const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 5000;

// Initialize Socket.IO
const io = setupSocket(server);

// Make io accessible in routes if needed
app.set("io", io);

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.use((req, res) => {
  res.status(404).json({ ERROR: "Route Not Found" });
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO ready on port ${PORT}`);
});