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
    budget_min: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ===============================================================
     SUBMIT — SEND NEW BACKEND-FRIENDLY FIELDS
  =============================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in to post a project.");

      const decoded = jwtDecode(token);
      const client_id = decoded.id;

      const payload = {
        title: formData.title,
        description: formData.description,
        budget_min: Number(formData.budget_min) || null,
        budget_max: null,
        skills: formData.skills || "General",
        deadline: null,
        client_id,
      };

      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,   // ✅ IMPORTANT FIX
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Project created successfully!");
        navigate("/dashboard");
      } else {
        alert(`❌ ${data.ERROR || "Error creating project"}`);
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

        {/* LEFT — FORM */}
        <form className="postproject-form" onSubmit={handleSubmit}>
          <label>Project Title <span>*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your project title"
            required
          />

          <label>Description <span>*</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project"
            required
          ></textarea>

          <div className="two-column">
            <div className="form-group">
              <label>Budget (₹)</label>
              <input
                type="number"
                name="budget_min"
                value={formData.budget_min}
                onChange={handleChange}
                placeholder="e.g. 5000"
              />
            </div>

            <div className="form-group">
              <label>Required Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Web Dev, UI/UX, React..."
              />
            </div>
          </div>

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>

        {/* RIGHT — LIVE PREVIEW */}
        <div className="project-preview">
          <h3>🧩 Project Summary</h3>
          <p>This project will appear in Browse Jobs for freelancers.</p>

          <div className="preview-card">
            <h4>{formData.title || "Untitled Project"}</h4>

            <p>
              {formData.description
                ? formData.description.slice(0, 90) + "..."
                : "Your project description preview will appear here."}
            </p>

            <p><strong>💰 Budget:</strong> ₹{formData.budget_min || "Not set"}</p>
            <p><strong>🛠 Skills:</strong> {formData.skills || "Not specified"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProjectPage;
