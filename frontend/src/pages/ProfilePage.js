

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:5001/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => navigate("/login"));
  }, []);

  if (!user)
    return (
      <div className="loading-wrapper">
        <div className="loader-ring"></div>
        <p>Loading your profile...</p>
      </div>
    );
  
  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const saveChanges = async () => {
    const token = localStorage.getItem("token");

    const allowed = {};
    const allowedFields = [
      "name",
      "username",
      "age",
      "gender",
      "city",
      "state",            
      "experience",
      "skills",
      "portfolio_url",
      "organization",
      "aboutOrg",
      "department",        
      "designation",       
      "about",            
    ];

    allowedFields.forEach((field) => {
      if (user[field] !== undefined) {
        allowed[field] = user[field];
      }
    });

    const res = await fetch("http://localhost:5001/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(allowed),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.ERROR);

    alert("Profile updated successfully!");
    setEditMode(false);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-header-banner"></div>

      <div className="profile-avatar-section">
        <FaUserCircle className="profile-avatar-icon" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-username">@{user.username}</p>
        <span className="role-pill">{user.role}</span>
      </div>

      <div className="profile-main-card">
        <h3 className="card-title">Profile Information</h3>

        <div className="profile-grid">
          <div className="field">
            <label>Name</label>
            <input
              disabled={!editMode}
              name="name"
              value={user.name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Username</label>
            <input
              disabled={!editMode}
              name="username"
              value={user.username || ""}
              onChange={handleChange}
            />
          </div>

          <div className="field full">
            <label>Email</label>
            <input disabled value={user.email} />
          </div>

          {user.role === "freelancer" && (
            <>
              <div className="field">
                <label>Age</label>
                <input
                  disabled={!editMode}
                  name="age"
                  value={user.age || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Gender</label>
                <select
                  disabled={!editMode}
                  name="gender"
                  value={user.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="field">
                <label>City</label>
                <input
                  disabled={!editMode}
                  name="city"
                  value={user.city || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>State</label>
                <input
                  disabled={!editMode}
                  name="state"
                  value={user.state || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Experience (Years)</label>
                <input
                  disabled={!editMode}
                  name="experience"
                  value={user.experience || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label>Skills</label>
                <input
                  disabled={!editMode}
                  name="skills"
                  value={user.skills || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label>Portfolio URL</label>
                <input
                  disabled={!editMode}
                  name="portfolio_url"
                  value={user.portfolio_url || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {user.role === "client" && (
            <>
              <div className="field">
                <label>Organization Name</label>
                <input
                  disabled={!editMode}
                  name="organization"
                  value={user.organization || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>City</label>
                <input
                  disabled={!editMode}
                  name="city"
                  value={user.city || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label>About Organization</label>
                <textarea
                  disabled={!editMode}
                  name="aboutOrg"
                  value={user.aboutOrg || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {user.role === "admin" && (
            <>
              <div className="field">
                <label>Department</label>
                <input
                  disabled={!editMode}
                  name="department"
                  value={user.department || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Designation</label>
                <input
                  disabled={!editMode}
                  name="designation"
                  value={user.designation || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label>About</label>
                <textarea
                  disabled={!editMode}
                  name="about"
                  value={user.about || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>

        <div className="profile-buttons">
          {!editMode ? (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={saveChanges}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
