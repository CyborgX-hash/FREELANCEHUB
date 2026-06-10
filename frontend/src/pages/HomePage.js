import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
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

  const aboutRef = useRef(null);
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
            <h1 className="splash-title">FreelanceHub</h1>
            <p className="splash-sub">~ sketched with love ~</p>
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

                      <p className="logout" onClick={logout}>
                        <FaSignOutAlt /> Logout
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* ---- HERO (replaces video) ---- */}
          <section className="hero-sketchy">
            <div className="hero-doodles" aria-hidden="true">
              {/* Decorative SVG elements */}
              <svg className="doodle-arrow" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 50 C30 10, 70 10, 100 30" stroke="#2d2d2d" strokeWidth="2.5" strokeDasharray="6 4" fill="none"/>
                <path d="M90 22 L102 32 L88 36" stroke="#2d2d2d" strokeWidth="2.5" fill="none"/>
              </svg>
              <div className="doodle-circle" />
              <div className="doodle-star">✦</div>
            </div>

            <div className="hero-content-sketchy">
              <h2>
                Where ideas turn into
                <span className="hero-highlight"> successful </span>
                collaborations<span className="hero-bang" aria-hidden="true">!</span>
              </h2>
              <p className="hero-sub">
                Search, hire & collaborate with industry-leading professionals worldwide.
              </p>

              <button
                className="sketchy-btn filled hero-cta"
                onClick={() => navigate("/dashboard")}
              >
                Get Started →
              </button>
            </div>

            {/* Notebook placeholder illustration */}
            <div className="hero-illustration" aria-hidden="true">
              <div className="notebook-page">
                <div className="notebook-line" />
                <div className="notebook-line" />
                <div className="notebook-line" />
                <div className="notebook-line" />
                <div className="notebook-scribble">✎ your next project</div>
              </div>
            </div>
          </section>

          {/* ---- ABOUT ---- */}
          <section ref={aboutRef} className="about-section-sketchy">
            <div className="section-tape" aria-hidden="true" />
            <h2>About Us</h2>
            <p>
              FreelanceHub is a modern freelancing platform designed to seamlessly connect
              clients with skilled freelancers across various domains such as web development,
              design, mobile apps, AI, marketing, and content creation
            </p>
          </section>

          {/* ---- SERVICES ---- */}
          <section className="services-section-sketchy">
            <h2>Popular Services</h2>

            <div className="services-grid-sketchy">
              {[
                { title: "Web Development", desc: "Frontend, backend, full-stack solutions.", emoji: "🌐" },
                { title: "UI/UX Design", desc: "Modern & intuitive user experiences.", emoji: "🎨" },
                { title: "AI Automation", desc: "Automate workflows with smart AI.", emoji: "🤖" },
                { title: "Marketing", desc: "Branding, SEO & business growth.", emoji: "📈" },
              ].map((s, i) => (
                <div
                  className="service-card-sketchy"
                  key={i}
                  style={{ transform: `rotate(${i % 2 === 0 ? '-1' : '1'}deg)` }}
                >
                  <span className="service-emoji">{s.emoji}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---- TESTIMONIALS ---- */}
          <section className="testimonials-section-sketchy">
            <h2 className="section-title-sketchy">Testimonials</h2>

            <div className="testimonials-wrapper-sketchy">
              {[
                { name: "Aman Sharma", text: "Amazing platform! I found a skilled developer within hours.", role: "Startup Founder" },
                { name: "Priya Verma", text: "Top-level work. Smooth and reliable process.", role: "Marketing Manager" },
                { name: "Rahul Singh", text: "Excellent quality delivered on time.", role: "Entrepreneur" },
                { name: "Sneha Patel", text: "Beautiful UI/UX work!", role: "Product Owner" },
                { name: "Karan Mehta", text: "Great communication and fast delivery.", role: "Client" },
                { name: "Drishti Kapoor", text: "Amazing video editors here!", role: "Content Creator" },
                { name: "Vivek Rao", text: "Very smooth experience overall.", role: "Business Owner" },
              ].map((t, i) => (
                <div className="testimonial-card-sketchy" key={i}>
                  {/* Speech bubble tail */}
                  <div className="speech-tail" aria-hidden="true" />
                  <p className="testimonial-text-sketchy">"{t.text}"</p>
                  <h4 className="testimonial-name-sketchy">{t.name}</h4>
                  <p className="testimonial-role-sketchy">{t.role}</p>
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
