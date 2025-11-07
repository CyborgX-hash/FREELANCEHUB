import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [user, setUser] = useState({ name: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || "User",
          role: decoded.role || "Freelancer",
        });
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2>FreelanceHub</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-content">
        <h1>👋 Welcome, {user.name}</h1>
        <p className="subtitle">
          Role: <strong>{user.role}</strong> — Manage your freelance journey here.
        </p>

        {/* CLIENT DASHBOARD */}
        {user.role === "Client" && (
          <div className="cards-container">
            <div className="dash-card">
              <h3>💼 My Projects</h3>
              <p>View and manage projects you’ve posted.</p>
            </div>

            <div className="dash-card">
              <h3>🧑‍💻 Hire Freelancers</h3>
              <p>Find and hire top-rated freelance professionals.</p>
            </div>

            <div className="dash-card">
              <h3>💬 Messages</h3>
              <p>Chat with freelancers you’ve hired or shortlisted.</p>
            </div>

            <div className="dash-card">
              <h3>⚙️ Account Settings</h3>
              <p>Update your profile and payment information.</p>
            </div>
          </div>
        )}

        {/* FREELANCER DASHBOARD (we'll build this next) */}
        {user.role === "Freelancer" && (
          <div className="cards-container">
            <div className="dash-card">
              <h3>🔍 Browse Jobs</h3>
              <p>Find freelance projects that match your skills.</p>
            </div>

            <div className="dash-card">
              <h3>📄 My Proposals</h3>
              <p>Track your submitted bids and job applications.</p>
            </div>

            <div className="dash-card">
              <h3>💼 My Projects</h3>
              <p>Manage your active and completed client work.</p>
            </div>

            <div className="dash-card">
              <h3>🏆 Earnings</h3>
              <p>Check your earnings and performance insights.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
