import React, { useState } from "react";
import "./PostProject.css";

const PostProject = ({ onClose, clientId, apiUrl }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    category: "",
    deadline: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          ...form,
          budget_min: form.budget, // temporary mapping if needed
          budget_max: form.budget,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create project");

      alert("Project created successfully!");
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Post a New Project</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Project title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Project description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            name="skills"
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={handleChange}
          />

          {/* ⭐ 2 Column Budget + Category */}
          <div className="form-row">
            <div className="form-group">
              <label>Budget (₹)</label>
              <input
                type="number"
                name="budget"
                placeholder="e.g. 5000"
                value={form.budget}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Web Dev, Design, AI..."
                value={form.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />

          <div className="actions">
            <button type="submit">Post</button>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
