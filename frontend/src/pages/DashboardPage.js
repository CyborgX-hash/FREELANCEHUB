import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  FaUserCircle,
  FaUser,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || "User",
          email: decoded.email || "user@example.com",
          role: decoded.role || "Freelancer",
        });
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2>FreelanceHub</h2>

        <div className="profile-container">
          <FaUserCircle className="profile-icon" onClick={toggleMenu} />
          {showMenu && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowProfile(true);
                  setShowMenu(false);
                }}
              >
                <FaUser /> &nbsp; View Profile
              </div>
              <div className="dropdown-item" onClick={toggleTheme}>
                {theme === "dark" ? <FaSun /> : <FaMoon />} &nbsp;
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt /> &nbsp; Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome {user.name}</h1>
        

        {user.role === "Client" && (
          <div className="cards-container">
            <p className="subtitle">
        Hire Your Freelancer Here.
        </p>
            <div className="dash-card">
              <h3>💼 Live Projects</h3>
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
            
          </div>
        )}

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

      {showProfile && (
        <div className="profile-modal">
          <div className="profile-card">
            <FaUserCircle className="profile-avatar" />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className="role-badge">{user.role}</span>

            <div className="profile-buttons">
              <button className="edit-btn">
                <FaEdit /> Edit Profile
              </button>
              <button
                className="close-btn"
                onClick={() => setShowProfile(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
