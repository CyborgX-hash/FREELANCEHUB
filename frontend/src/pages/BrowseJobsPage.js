import React, { useEffect, useState, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const [applyOpen, setApplyOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [appliedIds, setAppliedIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cardsPerPage = 8;

  // Load user's applied job IDs once
  useEffect(() => {
    getAppliedProjects()
      .then((res) => {
        const ids = (res?.applications || []).map((a) => a.project_id);
        setAppliedIds(ids);
      })
      .catch((err) => console.error("Error loading applied jobs:", err));
  }, []);

  // Fetch server-paginated & filtered jobs
  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProjects({
        page: currentPage,
        limit: cardsPerPage,
        search,
        category: categoryFilter,
        sortBy,
      });

      setProjects(res?.projects || []);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching jobs from server:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, categoryFilter, sortBy]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

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
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => handleFilterChange(setCategoryFilter, e.target.value)}
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

        <select
          value={sortBy}
          onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget-low">Budget: Low → High</option>
          <option value="budget-high">Budget: High → Low</option>
        </select>
      </div>

      {loading ? (
        <div className="loader">Loading server data...</div>
      ) : (
        <div className="projects-grid">
          {projects.length === 0 ? (
            <p className="no-conversations" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
              No projects found matching your criteria.
            </p>
          ) : (
            projects.map((p) => (
              <div className="project-card" key={p.id}>
                <h3>{p.title}</h3>
                <p className="desc">{p.description?.slice(0, 120)}...</p>

                <p>
                  <strong>Budget:</strong> {p.budget || `₹${p.budget_min || "N/A"}`}
                </p>
                <p>
                  <strong>Skills:</strong> {p.skills || "Not specified"}
                </p>
                <p>
                  <strong>Client:</strong> {p.client?.name || "Unknown"}
                </p>

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
      )}

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
