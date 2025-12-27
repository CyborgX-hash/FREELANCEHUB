import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  fetchClientProjects,
  deleteProject,
} from "../api"; // ✅ centralized API
import "./MyProjectsPage.css";

export default function MyProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /* FETCH CLIENT PROJECTS */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { id: clientId } = jwtDecode(token);

    const loadProjects = async () => {
      try {
        const data = await fetchClientProjects(clientId);
        setProjects(data?.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  /* DELETE PROJECT */
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure? This cannot be undone!")) return;

    const res = await deleteProject(projectId);

    if (res?.ERROR) {
      alert(res.ERROR);
      return;
    }

    alert("Project deleted!");
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const editProject = (project) => navigate(`/edit-project/${project.id}`);

  /* FILTER + SORT */
  const filteredProjects = projects
    .filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category === "all"
        ? true
        : (p.category || "")
            .toLowerCase()
            .includes(category.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "budget-high")
        return (b.budget_min || 0) - (a.budget_min || 0);
      if (sortBy === "budget-low")
        return (a.budget_min || 0) - (b.budget_min || 0);
      return 0;
    });

  /* PAGINATION */
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  if (loading)
    return (
      <div className="loading-wrapper">
        <div className="loader-ring"></div>
        <p>Loading your projects...</p>
      </div>
    );

  return (
    <div className="myprojects-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h2>My Projects</h2>

      {/* CONTROLS */}
      <div className="project-controls">
        <input
          type="text"
          placeholder="Search by project title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Design">Design</option>
          <option value="AI / Machine Learning">AI / Machine Learning</option>
          <option value="Mobile App">Mobile App</option>
          <option value="Marketing">Marketing</option>
          <option value="Writing">Writing</option>
          <option value="Video Editing">Video Editing</option>
          <option value="General">General</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget-high">Budget: High → Low</option>
          <option value="budget-low">Budget: Low → High</option>
        </select>
      </div>

      {/* PROJECT LIST */}
      {paginatedProjects.length === 0 ? (
        <p className="empty-msg">No matching projects found.</p>
      ) : (
        <div className="project-list">
          {paginatedProjects.map((project) => (
            <div className="project-card" key={project.id}>
              <h3>{project.title}</h3>

              <p className="description">
                {project.description?.slice(0, 140)}...
              </p>

              <div className="info">
                <p>
                  <strong>💰 Budget:</strong>{" "}
                  ₹{project.budget_min || "Not set"}
                </p>
                <p>
                  <strong>📂 Category:</strong>{" "}
                  {project.category || "General"}
                </p>
                <p>
                  <strong>🛠 Skills:</strong>{" "}
                  {project.skills || "Not specified"}
                </p>
              </div>

              <p className="date">
                Posted on{" "}
                {new Date(project.created_at).toLocaleDateString()}
              </p>

              <div className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => editProject(project)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            ⬅ Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next ➞
          </button>
        </div>
      )}
    </div>
  );
}
