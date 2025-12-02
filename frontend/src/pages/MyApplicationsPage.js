import React, { useEffect, useState } from "react";
import { getAppliedProjects, withdrawApplication } from "../api";
import "./MyApplicationsPage.css";

const MyApplicationsPage = () => {
  const [apps, setApps] = useState([]);

  const loadApps = async () => {
    const res = await getAppliedProjects();
    setApps(res.applications || []);
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Withdraw application?")) return;

    const res = await withdrawApplication(applicationId);

    if (res.ERROR) return alert(res.ERROR);

    alert("Withdrawn");

    // Remove from UI immediately
    setApps(prev => prev.filter(a => a.id !== applicationId));
  };

  return (
    <div className="myapps-container">
      <h2>My Applications</h2>

      {apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        apps.map(a => (
          <div key={a.id} className="app-card">
            <h3>{a.project.title}</h3>

            <p>{a.cover_letter?.slice(0, 150) || "No message"}</p>

            <p><strong>Status:</strong> {a.status}</p>

            <div className="app-actions">
              <button onClick={() => window.location = `/project/${a.project.id}`}>
                View Project
              </button>

              <button className="danger" onClick={() => handleWithdraw(a.id)}>
                Withdraw
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplicationsPage;
