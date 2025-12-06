import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import ProfileCard from "./ProfilePage";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  // THEME (default from localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  /* ============================================================
      ON MOUNT → Load User + Set Theme
  ============================================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }

    // Apply theme to <html>
    document.documentElement.setAttribute("data-theme", theme);

  }, []); // run once on page load

  /* ============================================================
      UPDATE THEME WHEN CHANGED
  ============================================================ */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ============================================================
      LOGOUT
  ============================================================ */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenu(false);
    navigate("/");
  };

  /* ============================================================
      START BUTTON
  ============================================================ */
  const handleGetStarted = () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="home">

      {/* ========== NAVBAR ========== */}
      <nav className="nav">
        <h1 className="logo">FreelanceHub</h1>

        <div className="nav-right">
          {!user ? (
            <>
              <button className="nav-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="nav-btn filled" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </>
          ) : (
            <div className="user-box">
              <FaUserCircle
                className="user-icon"
                onClick={() => setMenu((prev) => !prev)}
              />

              {menu && (
                <div className="nav-menu">

                  {/* Profile */}
                  <p
  onClick={() => {
    navigate("/profile");
    setMenu(false);
  }}
>
  <FaUser /> Profile
</p>

                  {/* Theme Switch */}
                  <p
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                    {theme === "light" ? " Dark Mode" : " Light Mode"}
                  </p>

                  {/* Logout */}
                  <p className="logout" onClick={logout}>
                    <FaSignOutAlt /> Logout
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="hero">
        <h2>Hire Top Freelancers. Build Faster.</h2>
        <p>
          Find skilled developers, designers, editors & more — start your project instantly.
        </p>

        <div className="hero-buttons">
          <button className="btn primary" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="features">
        <h3>What Makes Us Different?</h3>

        <div className="grid">
          <div className="card">
            <h4>⚡ Fast Hiring</h4>
            <p>Post a project & get responses in minutes.</p>
          </div>

          <div className="card">
            <h4>🌍 Global Talent</h4>
            <p>Hire from a pool of skilled professionals worldwide.</p>
          </div>

          <div className="card">
            <h4>📈 Smart Matching</h4>
            <p>We recommend best freelancers for your project.</p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <p>© 2025 FreelanceHub — Work from Anywhere</p>
        <div>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </footer>

      {/* ========== PROFILE MODAL ========== */}
      {openProfile && (
        <ProfileCard user={user} onClose={() => setOpenProfile(false)} />
      )}
    </div>
  );
}
