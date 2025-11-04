import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("FreelanceHub Backend is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
