import mysql from "mysql2";
import dotenv from "dotenv";

// Correct path for env
dotenv.config({ path: "/Users/sakshamsontakke/Desktop/freelancehub/backend/.env" });

console.log("ENV in DB:", process.env.MYSQLHOST, process.env.MYSQLUSER);

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

export default db;
