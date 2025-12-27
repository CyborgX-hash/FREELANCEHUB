import React, { useEffect, useState } from "react";
import { getProjectApplications } from "../api"; // ✅ centralized API
import "./AppliedFreelancersPage.css";

export default function FreelancersAppliedList({ projectId }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const loadApplications = async () => {
      try {
        const data = await getProjectApplications(projectId);
        setApps(data?.applications || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [projectId]);

  if (loading) {
    return <div className="loader">Loading applications...</div>;
  }

  return (
    <div className="af-container">
      <h2>Freelancers Who Applied</h2>

      <div className="table-header">
        <span>Name</span>
        <span>Email</span>
        <span>Proposal</span>
        <span>Portfolio</span>
      </div>

      {apps.length === 0 ? (
        <p className="empty-msg">No applications yet.</p>
      ) : (
        apps.map((a) => (
          <div key={a.id} className="table-row">
            <span>{a.freelancer?.name || "N/A"}</span>
            <span>{a.freelancer?.email || "N/A"}</span>
            <span>{a.cover_letter || "—"}</span>

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
        ))
      )}
    </div>
  );
}
