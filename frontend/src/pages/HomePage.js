import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import heroVideo from "../Assets/vdo.webm";
import logo from "../Assets/logo.png";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);

  // 🌟 SPLASH LOGIC — SHOW ONLY FIRST TIME
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeen = localStorage.getItem("seenSplash");
    return hasSeen ? false : true;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const menuRef = useRef(null);

  /* ---------------- SPLASH SCREEN CONTROL ---------------- */
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem("seenSplash", "true");
      }, 2200); // splash visible time

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  /* ---------------- LOAD USER + THEME ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {}
    }

    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const scrollToSection = (ref) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  return (
    <div className="home">

      {/* =================== SPLASH LOGO =================== */}
      {showSplash && (
        <div className="logo-overlay">
          <div className="logo-fullscreen">
            <img src={logo} alt="Logo" />
          </div>
        </div>
      )}

      {/* =================== MAIN HOME PAGE =================== */}
      {!showSplash && (
        <>
          <nav className="nav">
            <h1 className="logo" onClick={() => navigate("/")}>FreelanceHub</h1>

            <div className="nav-center">
              <p onClick={() => navigate("/")}>Home</p>
              <p onClick={() => scrollToSection(aboutRef)}>About Us</p>
            </div>

            <div className="nav-right" ref={menuRef}>
              {!user ? (
                <>
                  <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
                  <button className="nav-btn filled" onClick={() => navigate("/signup")}>Sign Up</button>
                </>
              ) : (
                <div className="user-box">
                  <FaUserCircle className="user-icon" onClick={() => setMenu(!menu)} />

                  {menu && (
                    <div className="nav-menu">
                      <p onClick={() => { navigate("/profile"); setMenu(false); }}>
                        <FaUser /> Profile
                      </p>
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

          {/* =================== HERO SECTION =================== */}
          <section className="hero">
            <video autoPlay muted loop className="hero-video">
              <source src={heroVideo} type="video/mp4" />
            </video>

            <div className="hero-content">
              <h2>Our freelancers will take it from here</h2>
              <p>Search, hire & collaborate with industry-leading professionals worldwide.</p>
              <button className="btn primary" onClick={() => navigate("/dashboard")}>
                Get Started
              </button>
            </div>
          </section>

          {/* =================== ABOUT US =================== */}
          <section ref={aboutRef} className="about-section">
            <h2>About Us</h2>
            <p>
              FreelanceHub connects businesses with verified freelancers worldwide.
              We simplify hiring with transparency, speed, and trust.
            </p>
          </section>

          {/* =================== SERVICES =================== */}
          <section ref={servicesRef} className="services-section">
            <h2>Our Services</h2>

            <div className="services-grid">
              <div className="service-box"><h3>💻 Web Development</h3><p>Frontend, backend, full-stack solutions.</p></div>
              <div className="service-box"><h3>🎨 UI/UX Design</h3><p>Modern & intuitive user experiences.</p></div>
              <div className="service-box"><h3>🤖 AI Automation</h3><p>Automate workflows with smart AI.</p></div>
              <div className="service-box"><h3>📣 Marketing</h3><p>Branding, SEO & business growth.</p></div>
            </div>
          </section>

          {/* =================== FOOTER =================== */}
          <footer className="footer">
            <p>© 2025 FreelanceHub — Work from Anywhere</p>
            <p>Made by Saksham</p>
          </footer>
        </>
      )}
    </div>
  );
}
