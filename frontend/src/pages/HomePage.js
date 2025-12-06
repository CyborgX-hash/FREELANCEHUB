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
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);

  /* ================= SPLASH LOGO TIMER ================= */
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500); // 2.5 sec
    return () => clearTimeout(timer);
  }, []);

  /* ================= LOAD USER & THEME ON MOUNT ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try { setUser(jwtDecode(token)); } catch {}
    }
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  /* ================= APPLY THEME ON CHANGE ================= */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

      {/* ===================== SPLASH SCREEN ===================== */}
      {showSplash && (
        <div className="splash-screen">
          <div className="glow-circle"></div>
          <img src={logo} alt="Logo" className="splash-logo" />
        </div>
      )}

      {/* ===================== MAIN PAGE ===================== */}
      {!showSplash && (
        <>
          {/* NAVBAR */}
          <nav className="nav">
            <h1 className="logo" onClick={() => navigate("/")}>FreelanceHub</h1>

            <div className="nav-center">
              <p onClick={() => navigate("/")}>Home</p>
              <p onClick={() => scrollToSection(aboutRef)}>About Us</p>
              <p onClick={() => scrollToSection(servicesRef)}>Our Services</p>
            </div>

            <div className="nav-right">
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

          {/* HERO SECTION */}
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

          {/* ABOUT SECTION */}
          <section ref={aboutRef} className="about-section">
            <h2>About Us</h2>
            <p>
              FreelanceHub connects businesses with verified, skilled freelancers.
              Our mission is to make hiring simple, fast, and transparent.
            </p>
          </section>

          {/* SERVICES SECTION */}
          <section ref={servicesRef} className="services-section">
            <h2>Our Services</h2>

            <div className="services-grid">
              <div className="service-box"><h3>💻 Web Development</h3><p>Full stack, frontend & backend experts.</p></div>
              <div className="service-box"><h3>🎨 UI/UX Design</h3><p>Beautiful interfaces for apps & websites.</p></div>
              <div className="service-box"><h3>🤖 AI & Automation</h3><p>Smart automation tools for business.</p></div>
              <div className="service-box"><h3>📣 Marketing</h3><p>SEO, branding & targeted campaigns.</p></div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="footer">
            <p>© 2025 FreelanceHub — Work from Anywhere</p>
            <p>Made by Saksham</p>
          </footer>
        </>
      )}
    </div>
  );
}
