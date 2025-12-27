import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {fetchProjectById,updateProject,} from "../api";
import "./EditProjectPage.css";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(id);
        setProject(data?.project || null);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProject(id, project);

      if (res?.ERROR) {
        alert(res.ERROR);
        return;
      }

      alert("Project updated successfully!");
      navigate("/my-projects");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating project");
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!project) return <div className="loader">Project not found</div>;

  return (
    <div className="edit-project-container">
      <h2>Edit Project</h2>

      <div className="edit-card">
        <form onSubmit={handleSubmit}>
          <label>Project Title</label>
          <input
            type="text"
            name="title"
            value={project.title || ""}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={project.description || ""}
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

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
