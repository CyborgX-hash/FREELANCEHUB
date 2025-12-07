import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import heroVideo from "../Assets/vdo.webm";
import logo from "../Assets/logo.png";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);

  const [showSplash, setShowSplash] = useState(() => {
    const seen = localStorage.getItem("seenSplash");
    return !seen; 
  });

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem("seenSplash", "true");
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try { setUser(jwtDecode(token)); }
        catch { setUser(null); }
      } else {
        setUser(null);
      }
    };

    loadUser(); 

    window.addEventListener("tokenChanged", loadUser);

    return () => window.removeEventListener("tokenChanged", loadUser);
  }, [location.key]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    window.dispatchEvent(new Event("tokenChanged"));
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  return (
    <div className="home">

      {showSplash && (
        <div className="logo-overlay">
          <div className="logo-fullscreen">
            <img src={logo} alt="Logo" />
          </div>
        </div>
      )}

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

          <section ref={aboutRef} className="about-section">
            <h2>About Us</h2>
            <p>FreelanceHub connects businesses with verified freelancers worldwide.</p>
          </section>

          <section ref={servicesRef} className="services-section">
            <h2>Popular Services</h2>

            <div className="services-grid">
              <div className="service-box"><h3>💻 Web Development</h3><p>Frontend, backend, full-stack solutions.</p></div>
              <div className="service-box"><h3>🎨 UI/UX Design</h3><p>Modern & intuitive user experiences.</p></div>
              <div className="service-box"><h3>🤖 AI Automation</h3><p>Automate workflows with smart AI.</p></div>
              <div className="service-box"><h3>📣 Marketing</h3><p>Branding, SEO & business growth.</p></div>
            </div>
          </section>

          <section className="testimonials-section">
            <h2 className="section-title">TESTIMONIAL</h2>

            <div className="testimonials-wrapper">
              {[
                { name: "Aman Sharma", text: "Amazing platform! I found a skilled developer within hours.", role: "Startup Founder" },
                { name: "Priya Verma", text: "Top-level work. Smooth and reliable process.", role: "Marketing Manager" },
                { name: "Rahul Singh", text: "Excellent quality delivered on time.", role: "Entrepreneur" },
                { name: "Sneha Patel", text: "Beautiful UI/UX work!", role: "Product Owner" },
                { name: "Karan Mehta", text: "Great communication and fast delivery.", role: "Client" },
                { name: "Drishti Kapoor", text: "Amazing video editors here!", role: "Content Creator" },
                { name: "Vivek Rao", text: "Very smooth experience overall.", role: "Business Owner" },
              ].map((t, i) => (
                <div className="testimonial-card" key={i}>
                  <p className="testimonial-text">“{t.text}”</p>
                  <h4 className="testimonial-name">{t.name}</h4>
                  <p className="testimonial-role">{t.role}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="footer">
            <p>© 2025 FreelanceHub — Work from Anywhere</p>
            <p>Made by Saksham</p>
          </footer>
        </>
      )}
    </div>
  );
}
