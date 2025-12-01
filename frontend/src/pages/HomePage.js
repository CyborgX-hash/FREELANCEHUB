import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import "./HomePage.css";
import ProfileCard from "/Users/sakshamsontakke/Desktop/freelancehub/frontend/src/pages/ProfileCard.js"; 

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState("light");
  const [openProfile, setOpenProfile] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {}
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenu(false);
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate("/signup"); 
      return;
    }

    navigate("/dashboard"); // works for both freelancer and client
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="nav">
        <h1 className="logo">FreelanceHub</h1>

        <div className="nav-right">
          {!user ? (
            <>
              <button onClick={() => navigate("/login")} className="nav-btn">Login</button>
              <button onClick={() => navigate("/signup")} className="nav-btn filled">Sign Up</button>
            </>
          ) : (
            <div className="user-box">
              <FaUserCircle 
                onClick={() => setMenu(!menu)} 
                className="user-icon" 
              />

              {menu && (
                <div className="nav-menu">

                  {/* OPEN PROFILE MODAL */}
                  <p onClick={() => { setOpenProfile(true); setMenu(false); }}>
                    <FaUser /> Profile
                  </p>

                  {/* THEME SWITCH */}
                  <p onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                    {theme === "light" ? " Dark Mode" : " Light Mode"}
                  </p>

                  <p className="logout" onClick={logout}>
                    <FaSignOutAlt /> Logout
                  </p>

                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <h2>Hire Top Freelancers. Build Faster.</h2>
        <p>Find skilled developers, designers, editors & more — start your project instantly.</p>

        <div className="hero-buttons">
          <button onClick={handleGetStarted} className="btn primary">
            Get Started
          </button>
        </div>

        
      </section>

      {/* FEATURES */}
      <section className="features">
        <h3>What Makes Us Different?</h3>

        <div className="grid">
          <div className="card"><h4>⚡ Fast Hiring</h4><p>Post a project & get responses in minutes.</p></div>
          <div className="card"><h4>🌍 Global Talent</h4><p>Hire from a pool of skilled professionals worldwide.</p></div>
          <div className="card"><h4>📈 Smart Matching</h4><p>We recommend best freelancers for your project.</p></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 FreelanceHub — Work from Anywhere</p>
        <div>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </footer>

      {/* PROFILE MODAL */}
      {openProfile && (
        <ProfileCard user={user} onClose={() => setOpenProfile(false)} />
      )}

    </div>
  );
}
