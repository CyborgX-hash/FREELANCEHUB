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

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Dashboard role =", decoded.role);

      setUser({
        id: decoded.id,
        name: decoded.name || "User",
        email: decoded.email,
        role: decoded.role,
      });
    } catch (err) {
      console.error("JWT decode error:", err);
      navigate("/");
      return;
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);
  }, [navigate]);

  const role = user.role?.toLowerCase();

  return (
    <div className="dashboard-container">

      <nav className="navbar">
        <h2>FreelanceHub</h2>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome {user.name}</h1>

        {role === "client" ? (
          <p className="subtitle">Manage your freelance journey here.</p>
        ) : (
          <p className="subtitle">Explore projects and showcase your skills.</p>
        )}

        {/* CLIENT */}
        {role === "client" && (
          <div className="cards-container">
            <div className="dash-card" onClick={() => navigate("/post-project")}>
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

        {/* FREELANCER */}
        {role === "freelancer" && (
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
