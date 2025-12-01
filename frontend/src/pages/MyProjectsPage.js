import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./MyProjectsPage.css";

const API_URL = "http://localhost:5001/api/projects";

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const clientId = decoded.id;

    fetch(`${API_URL}/client/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="myprojects-page">
      <h2>My Projects</h2>

      {projects.length === 0 ? (
        <p className="empty-msg">You have not posted any projects yet.</p>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div className="project-card" key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description || "No description added"}</p>

              <div className="info">
                <p><strong>💰 Budget:</strong> ₹{project.budget || "Not set"}</p>
                <p><strong>📂 Category:</strong> {project.category || "General"}</p>
                <p><strong>🔒 Visibility:</strong> {project.visibility}</p>
              </div>

              <p className="date">
                Posted on {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
