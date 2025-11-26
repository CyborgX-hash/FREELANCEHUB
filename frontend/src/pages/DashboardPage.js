// src/pages/DashboardPage.js

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          name: decoded.name || "User",
          email: decoded.email,
          role: decoded.role,
        });
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="dashboard-container">
      {/* SIMPLE CLEAN NAVBAR - NO PROFILE ICON */}
      <nav className="navbar">
        <h2>FreelanceHub</h2>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome {user.name}</h1>

        {user.role === "Client" ? (
          <p className="subtitle">Manage your freelance journey here.</p>
        ) : (
          <p className="subtitle">Explore projects and showcase your skills.</p>
        )}

        {/* CLIENT CARDS */}
        {user.role === "Client" && (
          <div className="cards-container">
            <div
              className="dash-card"
              onClick={() => navigate("/post-project")}
            >
              <h3>➕ Post a Project</h3>
              <p>Publish new freelance opportunities.</p>
            </div>

            <div className="dash-card">
              <h3>💼 My Projects</h3>
              <p>Track your posted work.</p>
            </div>

            <div className="dash-card">
              <h3>🧑‍💻 Applied Freelancers</h3>
              <p>See who applied for your projects.</p>
            </div>
          </div>
        )}

        {/* FREELANCER CARDS */}
        {user.role === "Freelancer" && (
          <div className="cards-container">
            <div className="dash-card">
              <h3>🔍 Browse Jobs</h3>
              <p>Find freelance jobs that match your skills.</p>
            </div>

            <div className="dash-card">
              <h3>📄 My Proposals</h3>
              <p>Track your submitted proposals.</p>
            </div>

            <div className="dash-card">
              <h3>💼 My Projects</h3>
              <p>Manage your active client work.</p>
            </div>

            <div className="dash-card">
              <h3>🏆 Earnings</h3>
              <p>Check your total freelancing earnings.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
