import React, { useEffect, useState } from "react";
import { applyToProject, fetchProjects } from "../api";
import "./BrowseJobsPage.css";

const BrowseJobsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");

  // Apply modal states
  const [applyOpen, setApplyOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [bid, setBid] = useState("");

  // Fetch all projects from backend
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await fetchProjects(); // using your api.js function

      if (result.projects) {
        setProjects(result.projects);
        setFiltered(result.projects);
      }
    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  // Search & filter logic
  useEffect(() => {
    let result = [...projects];

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          (p.description && p.description.toLowerCase().includes(s)) ||
          (p.skills && p.skills.toLowerCase().includes(s))
      );
    }

    if (skillFilter !== "all") {
      result = result.filter((p) =>
        p.skills?.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, skillFilter, projects]);

  // Open modal
  const openApply = (project) => {
    setActiveProject(project);
    setProposal("");
    setBid("");
    setApplyOpen(true);
  };

  // Apply to project API
  const handleApply = async () => {
    if (!activeProject) return;

    const payload = {
      projectId: activeProject.id,
      proposal,
      bid_amount: bid ? Number(bid) : undefined,
    };

    const result = await applyToProject(payload);

    if (result.ERROR) {
      alert(result.ERROR);
      return;
    }

    alert("Application submitted!");
    setApplyOpen(false);
  };

  return (
    <div className="browse-container">
      <h2>🔍 Browse Freelance Jobs</h2>

      {/* SEARCH + FILTER */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title, description, skills…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
          <option value="all">All Skills</option>
          <option value="web">Web Development</option>
          <option value="app">App Development</option>
          <option value="design">UI/UX Design</option>
          <option value="ai">AI / ML</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      {/* PROJECT GRID */}
      <div className="projects-grid">
        {filtered.length === 0 ? (
          <p className="no-results">No projects found 😢</p>
        ) : (
          filtered.map((project) => (
            <div className="project-card" key={project.id}>
              <h3>{project.title}</h3>

              <p className="desc">
                {project.description ? project.description.slice(0, 120) : "No description"}...
              </p>

              <p><strong>💰 Budget:</strong> ₹{project.budget_min} - ₹{project.budget_max}</p>

              <p><strong>📌 Skills:</strong> {project.skills || "Not specified"}</p>

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
              placeholder="Write a short proposal…"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            />

            <input
              type="number"
              placeholder="Your bid amount (optional)"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
            />

            <div className="modal-actions">
              <button className="apply-send" onClick={handleApply}>
                Send Application
              </button>
              <button className="cancel" onClick={() => setApplyOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;
