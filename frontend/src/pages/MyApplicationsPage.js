import React, { useEffect, useState, useCallback } from "react";
import { getAppliedProjects, withdrawApplication } from "../api";
import "./MyApplicationsPage.css";
import { useNavigate } from "react-router-dom";

const MyApplicationsPage = () => {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const appsPerPage = 6;

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAppliedProjects({
        page: currentPage,
        limit: appsPerPage,
      });

      setApps(res?.applications || []);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error loading applications:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Withdraw application?")) return;

    const res = await withdrawApplication(applicationId);
    if (res?.ERROR) return alert(res.ERROR);

    alert("Withdrawn");
    loadApps();
  };

  return (
    <div className="myapps-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>
      <h2>My Applications</h2>

      {loading ? (
        <div className="loader">Loading applications...</div>
      ) : apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <>
          <div className="app-grid">
            {apps.map((a) => (
              <div key={a.id} className="app-card">
                <h3>{a.project?.title || "Untitled Project"}</h3>

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

          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default MyApplicationsPage;
