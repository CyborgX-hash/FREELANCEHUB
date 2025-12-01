import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const API = "http://localhost:5001/api";

export default function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);
    fetch(`${API}/proposals/freelancer/${decoded.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setApps(d.proposals || []));
  }, []);
  return (
    <div>
      <h2>My Applications</h2>
      {apps.map(a => (
        <div key={a.id}>
          <h3>{a.project.title}</h3>
          <p>Bid: ₹{a.bid}</p>
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}

