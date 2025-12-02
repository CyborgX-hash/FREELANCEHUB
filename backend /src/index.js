const express = require("express");
const corsMiddleware = require("./config/cors.js");
const usersRouter = require("./routes/userRoute.js");
require("dotenv").config();
const projectRoutes = require("./routes/projectRoute");
const proposalRoutes = require("./routes/proposalRoute");



const app = express();
const PORT = process.env.SERVER_PORT;

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/applications", require("./routes/applicationRoute"));




app.use("/api/users", usersRouter)

app.get("/", (req, res) => { 
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
