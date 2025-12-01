import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "http://localhost:5001/api";

export default function AppliedFreelancersPage() {
  const { projectId } = useParams();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch(`${API}/proposals/project/${projectId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(r => r.json()).then(d => setApps(d.proposals || []));
  }, [projectId]);

  return (
    <div>
      <h2>Applicants</h2>
      {apps.map(a => (
        <div key={a.id} className="app-card">
          <h3>{a.freelancer.name} ({a.freelancer.username})</h3>
          <p>{a.cover_letter}</p>
          <p>Bid: ₹{a.bid}</p>
        </div>
      ))}
    </div>
  );
}

