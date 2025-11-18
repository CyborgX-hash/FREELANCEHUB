import db from "../config/db.js";

export const createProject = (req, res) => {
  const { client_id, title, description, budget, category, visibility } = req.body;

  if (!client_id || !title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO projects (client_id, title, description, budget, category, visibility)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [client_id, title, description, budget, category, visibility], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Project created successfully", projectId: result.insertId });
  });
};

export const getProjectsByClient = (req, res) => {
  const { clientId } = req.params;
  db.query("SELECT * FROM projects WHERE client_id = ?", [clientId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(results);
  });
};
