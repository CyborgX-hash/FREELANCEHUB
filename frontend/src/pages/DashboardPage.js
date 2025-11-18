import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  FaUserCircle,
  FaUser,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlusCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    bio: "",
    location: "",
    skills: "",
    hourly_rate: "",
    company: "",
  });

  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser((prev) => ({
          ...prev,
          id: decoded.id,
          name: decoded.name || "User",
          email: decoded.email || "user@example.com",
          role: decoded.role || "Freelancer",
        }));
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  // Handlers
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    console.log("Profile data to save:", user);
    alert("Profile updated successfully!");
    setEditMode(false);
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
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

      {/* Dashboard content */}
      <div className="dashboard-content">
        <h1>Welcome {user.name}</h1>
        {user.role === "Client" ? (
          <p className="subtitle">Manage your freelance journey here.</p>
        ) : user.role === "Freelancer" ? (
          <p className="subtitle">Explore projects and showcase your skills.</p>
        ) : null}

        {/* CLIENT VIEW */}
        {user.role === "Client" && (
          <div className="cards-container">
            <div
              className="dash-card"
              onClick={() => navigate("/post-project")}
              style={{ cursor: "pointer" }}
            >
              <h3>
                <FaPlusCircle /> Post a Project
              </h3>
              <p>Publish new freelance work opportunities.</p>
            </div>

            <div className="dash-card">
              <h3>💼 My Projects</h3>
              <p>View and manage your posted projects.</p>
            </div>

            <div className="dash-card">
              <h3>🧑‍💻 Hire Freelancers</h3>
              <p>Find and hire top-rated professionals.</p>
            </div>

            <div className="dash-card">
              <h3>💬 Messages</h3>
              <p>Chat with freelancers you’ve connected with.</p>
            </div>
          </div>
        )}

        {/* FREELANCER VIEW */}
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

      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-card">
            <FaUserCircle className="profile-avatar" />
            {!editMode ? (
              <>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <span className="role-badge">{user.role}</span>
                {user.bio && <p className="bio">"{user.bio}"</p>}
                {user.location && <p>📍 {user.location}</p>}
                {user.skills && <p>💡 Skills: {user.skills}</p>}
                {user.company && <p>🏢 Company: {user.company}</p>}

                <div className="profile-buttons">
                  <button className="edit-btn" onClick={() => setEditMode(true)}>
                    <FaEdit /> Edit Profile
                  </button>
                  <button
                    className="close-btn"
                    onClick={() => setShowProfile(false)}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="location"
                  value={user.location}
                  onChange={handleChange}
                  placeholder="Location"
                />
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  placeholder="Short Bio"
                />
                {user.role === "Freelancer" && (
                  <input
                    type="text"
                    name="skills"
                    value={user.skills}
                    onChange={handleChange}
                    placeholder="Skills (comma separated)"
                  />
                )}
                {user.role === "Client" && (
                  <input
                    type="text"
                    name="company"
                    value={user.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                  />
                )}

                <div className="profile-buttons">
                  <button className="edit-btn" onClick={handleSave}>
                    <FaSave /> Save
                  </button>
                  <button
                    className="close-btn"
                    onClick={() => setEditMode(false)}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
