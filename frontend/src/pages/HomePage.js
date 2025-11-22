import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  // Check login and redirect
  const handleProtectedNavigation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // If logged in → dashboard (role handled inside dashboard)
    navigate("/dashboard");
  };

  return (
    <div className="homepage-container">
      {/* NAVBAR */}
      <nav className="homepage-navbar">
        <h2 className="logo">FreelanceHub</h2>

        <div className="nav-links">
          <button onClick={() => navigate("/login")} className="nav-btn">
            Login
          </button>
          <button onClick={() => navigate("/signup")} className="nav-btn">
            Signup
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero-section">
        <h1>Find the Right Talent for Your Project</h1>
        <p className="hero-subtitle">
          Hire freelancers or get hired. Simple. Fast. Reliable.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={handleProtectedNavigation}>
            Find Projects
          </button>

          <button className="secondary-btn" onClick={handleProtectedNavigation}>
            Hire Freelancers
          </button>
        </div>

        <button className="get-started-btn" onClick={handleProtectedNavigation}>
          Get Started
        </button>
      </header>

      {/* CATEGORIES */}
      <section className="categories-section">
        <h2>Trending Categories</h2>

        <div className="categories-grid">
          <div className="category-card">Design</div>
          <div className="category-card">Web Development</div>
          <div className="category-card">Artificial Intelligence</div>
          <div className="category-card">Writing</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How It Works</h2>

        <div className="how-grid">
          <div className="how-card">
            <span className="icon">📄</span>
            <p>Post a Project</p>
          </div>
          <div className="how-card">
            <span className="icon">💰</span>
            <p>Get Bids</p>
          </div>
          <div className="how-card">
            <span className="icon">🤝</span>
            <p>Hire</p>
          </div>
          <div className="how-card">
            <span className="icon">⭐</span>
            <p>Review</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="homepage-footer">
        <p>© 2025 FreelanceHub. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
