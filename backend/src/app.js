import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "/Users/sakshamsontakke/Desktop/freelancehub/backend/.env" }); 

import cors from "cors";
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

console.log("ENV TEST:", process.env.MYSQLHOST, process.env.MYSQLUSER);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
