import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./AppliedFreelancersPage.css";

const API_URL = "http://localhost:5001/api/projects";

export default function AppliedFreelancersPage() {
  const navigate = useNavigate();  // ⭐ FIXED — useNavigate hook

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PER_PAGE = 8;

  /* ================================
     LOAD CLIENT PROJECTS
  ================================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const clientId = decoded.id;

    fetch(`${API_URL}/client/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
        setFiltered(data.projects || []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  /* ================================
     SEARCH FILTER
  ================================= */
  useEffect(() => {
    let results = [...projects];

    if (search.trim()) {
      const s = search.toLowerCase();
      results = results.filter((p) =>
        p.title.toLowerCase().includes(s)
      );
    }

    setFiltered(results);
    setPage(1);
  }, [search, projects]);

  /* ================================
     PAGINATION
  ================================= */
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const startIndex = (page - 1) * PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + PER_PAGE);

  return (
    <div className="af-container">

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
            onClick={() => navigate(`/applied-freelancers/${p.id}`)}  // ⭐ FIXED
          >
            <h3>{p.title}</h3>
            <p>{p.description?.slice(0, 80)}...</p>
            <p><strong>Skills:</strong> {p.skills}</p>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
