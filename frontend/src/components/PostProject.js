import React, { useState } from "react";
import "./PostProject.css";

const PostProject = ({ onClose, clientId, apiUrl }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post project");
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
          <input name="title" placeholder="Project title" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Project description" value={form.description} onChange={handleChange} required />
          <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
          <div className="budget-row">
            <input name="budget_min" placeholder="Min budget" value={form.budget_min} onChange={handleChange} />
            <input name="budget_max" placeholder="Max budget" value={form.budget_max} onChange={handleChange} />
          </div>
          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
          <div className="actions">
            <button type="submit">Post</button>
            <button type="button" className="cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
