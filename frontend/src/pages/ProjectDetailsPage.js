import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectById, applyToProject } from "../api";
import { jwtDecode } from "jwt-decode";
import "./ProjectDetailsPage.css";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showApplyBox, setShowApplyBox] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    loadProject();
  }, []);

  const loadProject = async () => {
    const data = await fetchProjectById(id);
    if (data?.project) setProject(data.project);
    setLoading(false);
  };

  const handleApply = async () => {
    if (!proposalText.trim()) {
      alert("Please write a proposal before applying.");
      return;
    }

    const payload = {
      projectId: Number(id),
      proposal: proposalText,
      bid_amount: bidAmount || null,
    };

    const response = await applyToProject(payload);

    if (response?.message) {
      alert("Application Submitted Successfully!");
      setShowApplyBox(false);
      setProposalText("");
      setBidAmount("");
    } else {
      alert(response?.ERROR || "Failed to submit application");
    }
  };

  if (loading) return <p className="loading-text">Loading project...</p>;
  if (!project) return <p className="error-text">Project not found</p>;

  return (
    <div className="project-details-page">

      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="project-card">

        <h1>{project.title}</h1>

        <p className="project-description">{project.description}</p>

        <div className="details-grid">

          <p><strong>Budget:</strong> ₹{project.budget_min || project.budget_max || "Not specified"}</p>

          <p><strong>Category:</strong> {project.category || "General"}</p>

          <p><strong>Client:</strong> {project.client?.name}</p>

          <p><strong>Visibility:</strong> {project.visibility}</p>

          <p><strong>Status:</strong> {project.status}</p>

          <p><strong>Posted:</strong> {new Date(project.created_at).toLocaleString()}</p>

        </div>

        {/* ONLY SHOW APPLY BUTTON TO FREELANCERS */}
        {user?.role === "freelancer" && (
          <button className="apply-btn" onClick={() => setShowApplyBox(true)}>
            Apply Now
          </button>
        )}
      </div>

      {/* APPLY MODAL */}
      {showApplyBox && (
        <div className="apply-overlay">
          <div className="apply-box">

            <h2>Submit Your Proposal</h2>

            <textarea
              placeholder="Write your proposal..."
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
            ></textarea>

            <input
              type="number"
              placeholder="Your Bid Amount (₹)"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />

            <div className="apply-actions">
              <button className="submit-btn" onClick={handleApply}>Submit</button>
              <button className="cancel-btn" onClick={() => setShowApplyBox(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetailsPage;
