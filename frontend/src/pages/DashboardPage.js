import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User");
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
        <h1>👋 Welcome, {userName}!</h1>
        <p className="subtitle">Here’s your freelancer workspace.</p>

        <div className="cards-container">
          <div className="dash-card">
            <h3>My Projects</h3>
            <p>View and manage your ongoing freelance projects.</p>
          </div>
          <div className="dash-card">
            <h3>Browse Jobs</h3>
            <p>Find new freelance gigs that match your skills.</p>
          </div>
          <div className="dash-card">
            <h3>Account Info</h3>
            <p>Update your profile and preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
