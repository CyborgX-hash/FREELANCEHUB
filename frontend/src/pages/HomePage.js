import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("JWT Error:", err);
      }
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const requireAuth = () => {
    if (!user) return navigate("/login");
    navigate("/dashboard");
  };

  return (
    <div className="homepage-container">
      <nav className="homepage-navbar">
        <h2 className="logo">FreelanceHub</h2>

        {!user ? (
          <div className="nav-links">
            <button className="nav-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="nav-btn" onClick={() => navigate("/signup")}>
              Signup
            </button>
          </div>
        ) : (
          <div className="profile-container">
            <FaUserCircle
              className="profile-icon"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => setShowProfile(true)}
                >
                  <FaUser /> View Profile
                </div>

                <div className="dropdown-item" onClick={toggleTheme}>
                  {theme === "dark" ? <FaSun /> : <FaMoon />} &nbsp;
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </div>

                <div className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      <header className="hero-section">
        <h1>Find the Right Talent for Your Projects</h1>
        <p className="hero-subtitle">
          A modern platform to hire freelancers or get hired instantly.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={requireAuth}>
            Find Projects
          </button>

          <button className="secondary-btn" onClick={requireAuth}>
            Hire Freelancers
          </button>
        </div>

        <button className="get-started-btn" onClick={requireAuth}>
          Get Started
        </button>
      </header>

      {showProfile && user && (
        <div className="home-profile-modal">
          <div className="home-profile-box">
            <FaUserCircle className="modal-avatar" />

            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p className="role-tag">{user.role}</p>

            <button
              className="close-profile-btn"
              onClick={() => setShowProfile(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
