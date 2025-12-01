import React, { useEffect, useState } from "react";
import { getAppliedProjects, withdrawApplication } from "../api";
import "./MyApplicationsPage.css";

const MyApplicationsPage = () => {
  const [apps, setApps] = useState([]);

  const fetch = async () => {
    const res = await getAppliedProjects();
    setApps(res.applications || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw application?")) return;
    const res = await withdrawApplication(id);
    if (res.ERROR) return alert(res.ERROR);
    alert("Withdrawn");
    fetch();
  };

  return (
    <div className="myapps-container">
      <h2>My Applications</h2>
      {apps.length === 0 ? <p>No applications yet.</p> : (
        apps.map(a => (
          <div key={a.id} className="app-card">
            <h3>{a.project.title}</h3>
            <p>{a.cover_letter?.slice(0,200) || "No message"}</p>
            <p><strong>Bid:</strong> {a.bid_amount ? `₹${a.bid_amount}` : "—"}</p>
            <p><strong>Status:</strong> {a.status}</p>
            <div className="app-actions">
              <button onClick={() => window.location = `/project/${a.project.id}`}>View Project</button>
              <button onClick={() => handleWithdraw(a.id)} className="danger">Withdraw</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplicationsPage;
