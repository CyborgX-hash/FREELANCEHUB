import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { fetchClientProjects } from "../api"; // ✅ centralized API
import "./AppliedFreelancersPage.css";

export default function AppliedFreelancersPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PER_PAGE = 8;

  /* FETCH CLIENT PROJECTS */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { id: clientId } = jwtDecode(token);

    fetchClientProjects(clientId)
      .then((data) => {
        setProjects(data?.projects || []);
        setFiltered(data?.projects || []);
      })
      .catch((err) => {
        console.error("Error fetching client projects:", err);
      });
  }, []);

  /* SEARCH FILTER */
  useEffect(() => {
    let results = [...projects];

    if (search.trim()) {
      const s = search.toLowerCase();
      results = results.filter((p) =>
        p.title?.toLowerCase().includes(s)
      );
    }

    setFiltered(results);
    setPage(1);
  }, [search, projects]);

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const startIndex = (page - 1) * PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + PER_PAGE);

  return (
    <div className="af-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h2>Your Posted Projects</h2>

      {/* SEARCH BAR */}
      <input
        className="search-box"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PROJECT CARDS */}
      <div className="af-grid">
        {paginated.map((p) => (
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

      {/* PAGINATION CONTROLS */}
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
