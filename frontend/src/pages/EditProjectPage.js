import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./EditProjectPage.css";

const API_URL = "http://localhost:5001/api/projects";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.project);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Unauthorized");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project), // includes category now
      });

      const data = await response.json();

      if (response.ok) {
        alert("Project updated successfully!");
        navigate("/my-projects");
      } else {
        alert(data.ERROR || "Failed to update project");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating project");
    }
  };

  if (loading || !project) return <div className="loader">Loading...</div>;

  return (
    <div className="edit-project-container">

      <h2>Edit Project</h2>

      <div className="edit-card">
        <form onSubmit={handleSubmit}>

          <label>Project Title</label>
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            required
          />

          <div className="two-row">
            <div className="field">
              <label>Budget (₹)</label>
              <input
                type="number"
                name="budget_min"
                value={project.budget_min || ""}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={project.skills || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ⭐ NEW CATEGORY FIELD */}
          <label>Category</label>
          <select
            name="category"
            value={project.category || "General"}
            onChange={handleChange}
          >
            <option value="General">General</option>
            <option value="Web Development">Web Development</option>
            <option value="Design">Design</option>
            <option value="AI / Machine Learning">AI / ML</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Marketing">Marketing</option>
            <option value="Writing">Writing</option>
            <option value="Video Editing">Video Editing</option>
          </select>

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
