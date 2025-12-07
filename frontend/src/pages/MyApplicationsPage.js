import React, { useEffect, useState } from "react";
import { getAppliedProjects, withdrawApplication } from "../api";
import "./MyApplicationsPage.css";
import { useNavigate } from "react-router-dom";


const MyApplicationsPage = () => {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);

  /* Pagination State */
  const [currentPage, setCurrentPage] = useState(1);
  const appsPerPage = 6;

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

    setApps((prev) => prev.filter((a) => a.id !== applicationId));
  };

  /* Pagination Logic */
  const lastIndex = currentPage * appsPerPage;
  const firstIndex = lastIndex - appsPerPage;
  const currentApps = apps.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(apps.length / appsPerPage);

  return (
    <div className="myapps-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
      ← Back
    </button>
      <h2>My Applications</h2>

      {apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <>
          {/* === GRID (3 cards per row) === */}
          <div className="app-grid">
            {currentApps.map((a) => (
              <div key={a.id} className="app-card">
                <h3>{a.project.title}</h3>

                <p>{a.cover_letter?.slice(0, 150) || "No proposal added"}</p>

                <p>
                  <strong>Status: </strong>
                  <span className="status-badge status-pending">{a.status}</span>
                </p>

                <div className="app-actions">
                  <button className="danger" onClick={() => handleWithdraw(a.id)}>
                    Withdraw
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* === PAGINATION === */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyApplicationsPage;
