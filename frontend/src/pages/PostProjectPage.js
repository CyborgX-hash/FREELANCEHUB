import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaArrowLeft } from "react-icons/fa";
import "./PostProjectPage.css";

const API_URL = "http://localhost:5001/api/projects";

const PostProjectPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    visibility: "public",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in to post a project.");

      const decoded = jwtDecode(token);
      const client_id = decoded.id;

      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, client_id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Project created successfully!");
        navigate("/dashboard");
      } else {
        alert(`❌ ${data.message || "Error creating project"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Something went wrong while creating the project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postproject-page">
      <div className="postproject-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>
        <h2>Create a New Project</h2>
      </div>

      <div className="postproject-container">
        {/* LEFT SIDE — FORM */}
        <form className="postproject-form" onSubmit={handleSubmit}>
          <label>
            Project Title <span>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your project title"
            required
          />

          <label>
            Description <span>*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project requirements"
            required
          ></textarea>

          <div className="field-row">
            <div style={{ flex: 1 }}>
              <label>Budget (in ₹)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 5000"
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Web Development, Design, AI..."
              />
            </div>
          </div>

          <label>Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
          >
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>

        {/* RIGHT SIDE — LIVE PREVIEW */}
        <div className="project-preview">
          <h3>🧩 Project Summary</h3>
          <p>
            This project will be listed on FreelanceHub for freelancers to view
            and apply.
          </p>

          <div className="preview-card">
            <h4>{formData.title || "Untitled Project"}</h4>
            <p>
              {formData.description
                ? formData.description.slice(0, 100) + "..."
                : "Your project description will appear here."}
            </p>
            <p>
              <strong>💰 Budget:</strong>{" "}
              {formData.budget ? `₹${formData.budget}` : "Not set"}
            </p>
            <p>
              <strong>📂 Category:</strong>{" "}
              {formData.category || "Not specified"}
            </p>
            <p>
              <strong>🔒 Visibility:</strong> {formData.visibility}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProjectPage;
