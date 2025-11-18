import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <nav className="home-navbar">
        <h2 className="logo">FreelanceHub</h2>

        <div className="nav-buttons">
          <button className="nav-login" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="nav-signup" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="hero">
        <h1>Work Smarter. Hire Faster.</h1>
        <p>
          Join India’s fastest growing freelance platform and connect with top
          clients & freelancers.
        </p>

        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default HomePage;
