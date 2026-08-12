import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectApplications, getOrCreateConversation } from "../api"; 
import "./AppliedFreelancersPage.css";

export default function FreelancersAppliedList({ projectId }) {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  const loadApplications = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const data = await getProjectApplications(projectId, {
        page,
        limit: itemsPerPage,
        search,
      });

      setApps(data?.applications || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, page, search]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStartChat = async (freelancerId) => {
    const res = await getOrCreateConversation({
      projectId: Number(projectId),
      otherUserId: freelancerId,
    });

    if (res.conversation) {
      navigate(`/chat?id=${res.conversation.id}`);
    } else {
      alert(res.ERROR || "Could not start conversation");
    }
  };

  return (
    <div className="af-container">
      <h2>Freelancers Who Applied</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          className="search-box"
          placeholder="Search applicants by name, email, or proposal..."
          value={search}
          onChange={handleSearchChange}
          style={{ width: "100%", maxWidth: "400px" }}
        />
      </div>

      <div className="table-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr", gap: "10px" }}>
        <span>Name</span>
        <span>Email</span>
        <span>Proposal</span>
        <span>Portfolio</span>
        <span>Action</span>
      </div>

      {loading ? (
        <div className="loader">Loading applications...</div>
      ) : apps.length === 0 ? (
        <p className="empty-msg">No applications found.</p>
      ) : (
        apps.map((a) => (
          <div key={a.id} className="table-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr", gap: "10px", alignItems: "center" }}>
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

            <span>
              {a.freelancer?.id && (
                <button
                  className="sketchy-btn secondary"
                  style={{ padding: "4px 10px", fontSize: "14px" }}
                  onClick={() => handleStartChat(a.freelancer.id)}
                >
                  💬 Chat
                </button>
              )}
            </span>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: "20px" }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
