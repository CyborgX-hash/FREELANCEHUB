import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API = "http://localhost:5001/api/projects";

export default function BrowseJobsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => { setProjects(data.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="browse-page">
      <h2>Browse Jobs</h2>
      <div className="grid">
        {projects.map(p => (
          <div key={p.id} className="job-card" onClick={() => navigate(`/projects/${p.id}`)}>
            <h3>{p.title}</h3>
            <p>{p.description?.slice(0,100)}...</p>
            <div className="meta">
              <span>₹{p.budget || "—"}</span>
              <span>{p.category || "General"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
