import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./MyProjectsPage.css";

const API_URL = "http://localhost:5001/api/projects";

export default function MyProjectsPage() {
  const navigate = useNavigate();
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

  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone!"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Project deleted successfully!");

        // remove from UI
        setProjects((prev) =>
          prev.filter((project) => project.id !== projectId)
        );
      } else {
        alert(data.ERROR || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong.");
    }
  };

  const editProject = (project) => {
    // OPTION 1: navigate to an edit page
    navigate(`/edit-project/${project.id}`);

    // OPTION 2: If you want modal editing, tell me & I'll create it
  };

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
                <p><strong>💰 Budget:</strong> ₹{project.budget_min || "Not set"}</p>
                <p><strong>📂 Category:</strong> {project.skills || "General"}</p>
                <p><strong>🔒 Visibility:</strong> {project.visibility}</p>
              </div>

              <p className="date">
                Posted on {new Date(project.created_at).toLocaleDateString()}
              </p>

              {/* ACTION BUTTONS */}
              <div className="action-buttons">

                {/* EDIT BUTTON */}
                <button
                  className="edit-btn"
                  onClick={() => editProject(project)}
                >
                Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="delete-btn"
                  onClick={() => deleteProject(project.id)}
                >
                   Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
