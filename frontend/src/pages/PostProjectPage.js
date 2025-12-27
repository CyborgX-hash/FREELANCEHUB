import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { createProject } from "../api";
import "./PostProjectPage.css";

const PostProjectPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget_min: "",
    skills: "",
    category: "General",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in");
        return;
      }

      const decoded = jwtDecode(token);

      const payload = {
        title: formData.title,
        description: formData.description,
        budget_min: Number(formData.budget_min) || null,
        budget_max: null,
        skills: formData.skills || "General",
        category: formData.category,
        deadline: null,
        client_id: decoded.id, 
      };

      const res = await createProject(payload);

      if (res?.ERROR) {
        alert(res.ERROR);
        return;
      }

      alert("Project created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Create project error:", error);
      alert("Something went wrong.");
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
            placeholder="Describe your project"
            required
          />

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
                placeholder="e.g. HTML, CSS, React"
              />
            </div>
          </div>

          <label>Project Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="General">General</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI / Machine Learning">AI / Machine Learning</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Content Writing">Content Writing</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>

        <div className="project-preview">
          <h3>🧩 Project Summary</h3>
          <p>This project will appear in Browse Jobs for freelancers.</p>

          <div className="preview-card">
            <h4>{formData.title || "Untitled Project"}</h4>

            <p>
              {formData.description
                ? formData.description.slice(0, 90) + "..."
                : "Your project description will appear here."}
            </p>

            <p>
              <strong>💰 Budget:</strong>{" "}
              ₹{formData.budget_min || "Not set"}
            </p>
            <p>
              <strong>🛠 Skills:</strong>{" "}
              {formData.skills || "Not specified"}
            </p>
            <p>
              <strong>📁 Category:</strong> {formData.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProjectPage;
