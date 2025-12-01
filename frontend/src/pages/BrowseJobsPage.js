import React, { useEffect, useState } from "react";
import { applyToProject } from "../api"; // ensure path
import "./BrowseJobsPage.css";

const API_URL = "http://localhost:5001/api/projects";

const BrowseJobsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Apply modal state
  const [applyOpen, setApplyOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [bid, setBid] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProjects(data.projects || []);
      setFiltered(data.projects || []);
    } catch (err) {
      console.error("Fetch projects error:", err);
    }
  };

  useEffect(() => {
    let result = [...projects];
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) =>
        p.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, categoryFilter, projects]);

  const openApply = (project) => {
    setActiveProject(project);
    setApplyOpen(true);
    setProposal("");
    setBid("");
  };

  const handleApply = async () => {
    if (!activeProject) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login as freelancer to apply.");
      return;
    }

    const payload = {
      projectId: activeProject.id,
      proposal,
      bid_amount: bid ? Number(bid) : undefined,
    };

    const result = await applyToProject(payload);
    if (result.ERROR) {
      alert(result.ERROR || "Apply failed");
      return;
    }

    alert("Applied successfully!");
    setApplyOpen(false);
  };

  return (
    <div className="browse-container">
      <h2>🔍 Browse Freelance Jobs</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="web">Web Development</option>
          <option value="design">Design</option>
          <option value="app">App Development</option>
          <option value="ai">AI / Machine Learning</option>
          <option value="marketing">Digital Marketing</option>
        </select>
      </div>

      <div className="projects-grid">
        {filtered.length === 0 ? (
          <p className="no-results">No projects found.</p>
        ) : (
          filtered.map((project) => (
            <div className="project-card" key={project.id}>
              <h3>{project.title}</h3>
              <p className="desc">{project.description.slice(0, 120)}...</p>
              <p><strong>💰 Budget:</strong> ₹{project.budget}</p>
              <p><strong>📂 Category:</strong> {project.category || "N/A"}</p>
              <p><strong>👤 Client:</strong> {project.client?.name}</p>

              <button className="apply-btn" onClick={() => openApply(project)}>
                Apply Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* APPLY MODAL */}
      {applyOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Apply to: {activeProject.title}</h3>

            <textarea
              placeholder="Write a short proposal..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            />

            <input
              type="number"
              placeholder="Your bid (optional)"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleApply}>Send Application</button>
              <button onClick={() => setApplyOpen(false)} className="cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;
