require("dotenv").config();
const express = require("express");

const corsMiddleware = require("./config/cors");

const userRoutes = require("./routes/userRoute");
const projectRoutes = require("./routes/projectRoute");
const proposalRoutes = require("./routes/proposalRoute");
const applicationRoutes = require("./routes/applicationRoute");

const errorHandler = require("./middlewares/errorMiddleware");

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// 
app.use(corsMiddleware);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.use((req, res) => {
  res.status(404).json({ ERROR: "Route Not Found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});