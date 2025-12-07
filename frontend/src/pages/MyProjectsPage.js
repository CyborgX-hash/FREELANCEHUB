import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./MyProjectsPage.css";

const API_URL = "http://localhost:5001/api/projects";

export default function MyProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW → Search, filter, sort, pagination states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /* =============================================
     FETCH USER PROJECTS
  ============================================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const clientId = decoded.id;

    fetch(`${API_URL}/client/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* =============================================
     DELETE PROJECT
  ============================================= */
  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure? This cannot be undone!");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Project deleted!");
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } else {
        alert(data.ERROR || "Failed to delete project");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  const editProject = (project) => navigate(`/edit-project/${project.id}`);

  /* =============================================
     APPLY SEARCH, CATEGORY FILTER & SORT
  ============================================= */
  const filteredProjects = projects
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category === "all"
        ? true
        : (p.skills || "").toLowerCase().includes(category.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "budget-high") return (b.budget_min || 0) - (a.budget_min || 0);
      if (sortBy === "budget-low") return (a.budget_min || 0) - (b.budget_min || 0);
      return 0;
    });

  /* =============================================
     PAGINATION LOGIC
  ============================================= */
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="myprojects-page">
      <h2>My Projects</h2>

      {/* ===== SEARCH + FILTER + SORT MENU ===== */}
      <div className="project-controls">
        <input
          type="text"
          placeholder="Search by project title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="web">Web Dev</option>
          <option value="design">Design</option>
          <option value="ai">AI/ML</option>
          <option value="marketing">Marketing</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget-high">Budget: High → Low</option>
          <option value="budget-low">Budget: Low → High</option>
        </select>
      </div>

      {/* ===== PROJECT LIST ===== */}
      {paginatedProjects.length === 0 ? (
        <p className="empty-msg">No matching projects found.</p>
      ) : (
        <div className="project-list">
          {paginatedProjects.map((project) => (
            <div className="project-card" key={project.id}>
              <h3>{project.title}</h3>

              <p>{project.description || "No description added"}</p>

              <div className="info">
                <p><strong>💰 Budget:</strong> ₹{project.budget_min || "Not set"}</p>
                <p><strong>📂 Category:</strong> {project.skills || "General"}</p>
              </div>

              <p className="date">
                Posted on {new Date(project.created_at).toLocaleDateString()}
              </p>

              <div className="action-buttons">
                <button className="edit-btn" onClick={() => editProject(project)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteProject(project.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== PAGINATION BUTTONS ===== */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          ⬅ Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next ➞
        </button>
      </div>
    </div>
  );
}
