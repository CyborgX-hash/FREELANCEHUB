// src/config/db.js
import mysql from "mysql2";

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Saksham@123",
  database: process.env.DB_NAME || "freelancehub",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

export default db;
