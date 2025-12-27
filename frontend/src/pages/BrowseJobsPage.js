import React, { useEffect, useState } from "react";
import {
  fetchProjects,
  applyToProject,
  getAppliedProjects,
} from "../api"; 
import { useNavigate } from "react-router-dom";
import "./BrowseJobsPage.css";

const BrowseJobsPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const [applyOpen, setApplyOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [appliedIds, setAppliedIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectRes = await fetchProjects();
        setProjects(projectRes?.projects || []);
        setFiltered(projectRes?.projects || []);

        const appliedRes = await getAppliedProjects();
        const ids = (appliedRes?.applications || []).map(
          (a) => a.project_id
        );
        setAppliedIds(ids);
      } catch (err) {
        console.error("Error loading browse data:", err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let result = [...projects];

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) =>
        p.skills?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "budget-low") {
      result.sort((a, b) => (a.budget_min || 0) - (b.budget_min || 0));
    } else if (sortBy === "budget-high") {
      result.sort((a, b) => (b.budget_min || 0) - (a.budget_min || 0));
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, categoryFilter, sortBy, projects]);

  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentCards = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / cardsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  const openApply = (project) => {
    setActiveProject(project);
    setProposal("");
    setPortfolio("");
    setApplyOpen(true);
  };

  const handleApply = async () => {
    if (!proposal.trim()) return alert("Please write a short proposal.");
    if (!portfolio.trim()) return alert("Portfolio URL is required.");

    const payload = {
      projectId: activeProject.id,
      proposal,
      portfolio_url: portfolio,
    };

    const res = await applyToProject(payload);
    if (res?.ERROR) return alert(res.ERROR);

    alert("Applied successfully!");
    setAppliedIds((prev) => [...prev, activeProject.id]);
    setApplyOpen(false);
  };

  return (
    <div className="browse-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h2>🔍 Browse Freelance Jobs</h2>

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
          <option value="mobile">Mobile App</option>
          <option value="ai">AI / Machine Learning</option>
          <option value="uiux">UI / UX Design</option>
          <option value="graphics">Graphic Design</option>
          <option value="video">Video Editing</option>
          <option value="content">Content Writing</option>
          <option value="copywriting">Copywriting</option>
          <option value="marketing">Digital Marketing</option>
          <option value="seo">SEO / SEM</option>
          <option value="finance">Finance & Accounting</option>
          <option value="general">General</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget-low">Budget: Low → High</option>
          <option value="budget-high">Budget: High → Low</option>
        </select>
      </div>

      <div className="projects-grid">
        {currentCards.map((p) => (
          <div className="project-card" key={p.id}>
            <h3>{p.title}</h3>
            <p className="desc">{p.description?.slice(0, 120)}...</p>

            <p>
              <strong>Budget:</strong> ₹{p.budget_min || "N/A"}
            </p>
            <p>
              <strong>Skills:</strong> {p.skills || "Not specified"}
            </p>
            <p>
              <strong>Client:</strong> {p.client?.name}
            </p>

            {appliedIds.includes(p.id) ? (
              <button className="applied-btn">Applied ✔</button>
            ) : (
              <button className="apply-btn" onClick={() => openApply(p)}>
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={prevPage}>⬅ Prev</button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={nextPage}>
            Next ➡
          </button>
        </div>
      )}

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
              type="text"
              placeholder="Portfolio Link (required)"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="portfolio-input"
              required
            />

            <div className="modal-actions">
              <button onClick={handleApply}>Submit</button>
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
