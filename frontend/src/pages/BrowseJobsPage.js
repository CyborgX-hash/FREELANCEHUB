import React, { useEffect, useState } from "react";
import { applyToProject, getAppliedProjects } from "../api";
import "./BrowseJobsPage.css";

const API_URL = "http://localhost:5001/api/projects";

const BrowseJobsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [applyOpen, setApplyOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [appliedIds, setAppliedIds] = useState([]);

  /* Load theme on mount (IMPORTANT FIX) */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  /* Fetch projects */
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

  /* Fetch applied */
  const fetchApplied = async () => {
    const res = await getAppliedProjects();
    const ids = (res.applications || []).map(a => a.project_id);
    setAppliedIds(ids);
  };

  useEffect(() => {
    fetchProjects();
    fetchApplied();
  }, []);

  /* Search + category filter */
  useEffect(() => {
    let result = [...projects];

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) =>
        p.skills?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, categoryFilter, projects]);

  /* APPLY POPUP */
  const openApply = (project) => {
    setActiveProject(project);
    setApplyOpen(true);
    setProposal("");
  };

  const handleApply = async () => {
    const payload = {
      projectId: activeProject.id,
      proposal,
    };

    const result = await applyToProject(payload);

    if (result.ERROR) {
      alert(result.ERROR);
      return;
    }

    alert("Applied successfully!");
    setAppliedIds((prev) => [...prev, activeProject.id]);
    setApplyOpen(false);
  };

  return (
    <div className="browse-container">

      <h2>🔍 Browse Freelance Jobs</h2>

      {/* FILTERS */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search projects..."
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
          <option value="ai">AI / ML</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      {/* PROJECT GRID */}
      <div className="projects-grid">
        {filtered.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          filtered.map((p) => (
            <div className="project-card" key={p.id}>
              <h3>{p.title}</h3>

              <p className="desc">{p.description.slice(0, 120)}...</p>

              <p><strong>Budget:</strong> ₹{p.budget_min || "N/A"}</p>
              <p><strong>Skills:</strong> {p.skills}</p>
              <p><strong>Client:</strong> {p.client?.name}</p>

              {appliedIds.includes(p.id) ? (
                <button className="applied-btn">Applied ✔</button>
              ) : (
                <button className="apply-btn" onClick={() => openApply(p)}>
                  Apply Now
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* APPLY POPUP */}
      {applyOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Apply to: {activeProject.title}</h3>

            <textarea
              placeholder="Write your proposal..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleApply}>Submit</button>
              <button className="cancel" onClick={() => setApplyOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BrowseJobsPage;
