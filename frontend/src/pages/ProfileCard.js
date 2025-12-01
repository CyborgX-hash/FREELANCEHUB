import React, { useState } from "react";
import "./ProfileCard.css";

const ProfileCard = ({ user, onClose }) => {
  const [editMode, setEditMode] = useState(false);

  // Store initial fields
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    gender: user?.gender || "",
    city: user?.city || "",
    experience: user?.experience || "",
    organization: user?.organization || "",
    aboutOrg: user?.aboutOrg || "",
    skills: user?.skills || "",
    portfolio_url: user?.portfolio_url || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in.");

      const response = await fetch("http://localhost:5001/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        return alert(data.ERROR || "Failed to update profile");
      }

      alert("Profile updated successfully!");

      // Update UI display
      Object.assign(user, data.user);

      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    }
  };

  /* ======================================================
      CANCEL → RESTORE ORIGINAL VALUES
  ====================================================== */
  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age || "",
      gender: user?.gender || "",
      city: user?.city || "",
      experience: user?.experience || "",
      organization: user?.organization || "",
      aboutOrg: user?.aboutOrg || "",
      skills: user?.skills || "",
      portfolio_url: user?.portfolio_url || "",
    });

    setEditMode(false);
  };

  return (
    <div className="profile-overlay">
      <div className="profile-card">
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>My Profile</h2>

        {/* ======================================================
            VIEW MODE
        ====================================================== */}
        {!editMode ? (
          <>
            <div className="profile-info">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>

              {user?.role === "freelancer" && (
                <>
                  {user.age && <p><strong>Age:</strong> {user.age}</p>}
                  {user.gender && <p><strong>Gender:</strong> {user.gender}</p>}
                  {user.city && <p><strong>City:</strong> {user.city}</p>}
                  {user.experience && (
                    <p><strong>Experience:</strong> {user.experience} years</p>
                  )}
                  {user.skills && <p><strong>Skills:</strong> {user.skills}</p>}
                  {user.portfolio_url && (
                    <p>
                      <strong>Portfolio:</strong>{" "}
                      <a href={user.portfolio_url} target="_blank">View</a>
                    </p>
                  )}
                </>
              )}

              {user?.role === "client" && (
                <>
                  {user.organization && (
                    <p><strong>Organization:</strong> {user.organization}</p>
                  )}
                  {user.aboutOrg && (
                    <p><strong>About Org:</strong> {user.aboutOrg}</p>
                  )}
                </>
              )}
            </div>

            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            {/* ======================================================
                EDIT MODE
            ====================================================== */}
            <div className="edit-section">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />

              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} />

              {/* FREELANCER FIELDS */}
              {user?.role === "freelancer" && (
                <>
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                  />

                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} />

                  <label>Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                  />

                  <label>Skills (comma separated)</label>
                  <input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                  />

                  <label>Portfolio URL</label>
                  <input
                    name="portfolio_url"
                    value={form.portfolio_url}
                    onChange={handleChange}
                  />
                </>
              )}

              {/* CLIENT FIELDS */}
              {user?.role === "client" && (
                <>
                  <label>Organization Name</label>
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                  />

                  <label>About Organization</label>
                  <textarea
                    name="aboutOrg"
                    value={form.aboutOrg}
                    onChange={handleChange}
                  />
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>

              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
