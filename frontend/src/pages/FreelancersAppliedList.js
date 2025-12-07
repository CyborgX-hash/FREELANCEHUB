import React, { useEffect, useState } from "react";
import "./AppliedFreelancersPage.css";

const API_URL = "http://localhost:5001/api/applications";

export default function FreelancersAppliedList({ projectId }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/project/${projectId}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(res => res.json())
      .then(data => setApps(data.applications || []));
  }, [projectId]);

  return (
    <div className="af-container">
      <h2>Freelancers Who Applied</h2>

      <div className="table-header">
        <span>Name</span>
        <span>Email</span>
        <span>Proposal</span>
        <span>Portfolio</span>
      </div>

      {apps.map((a) => (
        <div key={a.id} className="table-row">
          <span>{a.freelancer?.name}</span>
          <span>{a.freelancer?.email}</span>
          <span>{a.cover_letter}</span>

          {a.portfolio_url || a.freelancer?.portfolio_url ? (
            <a
              href={a.portfolio_url || a.freelancer.portfolio_url}
              target="_blank"
              rel="noreferrer"
            >
              Portfolio →
            </a>
          ) : (
            <span>No link</span>
          )}
        </div>
      ))}
    </div>
  );
}
