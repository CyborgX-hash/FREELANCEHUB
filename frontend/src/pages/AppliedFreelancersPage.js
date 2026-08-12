import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { fetchClientProjects } from "../api"; 
import "./AppliedFreelancersPage.css";

export default function AppliedFreelancersPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PER_PAGE = 8;

  const loadClientProjects = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { id: clientId } = jwtDecode(token);
    setLoading(true);

    try {
      const data = await fetchClientProjects(clientId, {
        page,
        limit: PER_PAGE,
        search,
      });

      setProjects(data?.projects || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching client projects:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadClientProjects();
  }, [loadClientProjects]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="af-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h2>Your Posted Projects</h2>

      <input
        className="search-box"
        placeholder="Search projects..."
        value={search}
        onChange={handleSearchChange}
      />

      {loading ? (
        <div className="loader">Loading projects...</div>
      ) : projects.length === 0 ? (
        <p className="empty-msg">No projects found.</p>
      ) : (
        <div className="af-grid">
          {projects.map((p) => (
            <div
              className="af-card"
              key={p.id}
              onClick={() => navigate(`/applied-freelancers/${p.id}`)}
            >
              <h3>{p.title}</h3>
              <p>{p.description?.slice(0, 80)}...</p>
              <p>
                <strong>Skills:</strong> {p.skills || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
