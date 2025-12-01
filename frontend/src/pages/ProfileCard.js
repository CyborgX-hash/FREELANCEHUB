import React, { useState } from "react";
import "./ProfileCard.css";

const ProfileCard = ({ user, onClose }) => {
  const [editMode, setEditMode] = useState(false);

  // Base fields
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    gender: user?.gender || "",
    city: user?.city || "",
    experience: user?.experience || "",
    organization: user?.organization || "",
    aboutOrg: user?.aboutOrg || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-overlay">
      <div className="profile-card">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2>My Profile</h2>

        {/* VIEW MODE */}
        {!editMode ? (
          <>
            <div className="profile-info">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>

              {/* FREELANCER EXTRA INFO */}
              {user?.role === "freelancer" && (
                <>
                  {form.age && <p><strong>Age:</strong> {form.age}</p>}
                  {form.gender && <p><strong>Gender:</strong> {form.gender}</p>}
                  {form.city && <p><strong>City:</strong> {form.city}</p>}
                  {form.experience && <p><strong>Experience:</strong> {form.experience} years</p>}
                </>
              )}

              {/* CLIENT EXTRA INFO */}
              {user?.role === "client" && (
                <>
                  {form.organization && (
                    <p><strong>Organization:</strong> {form.organization}</p>
                  )}
                  {form.aboutOrg && (
                    <p><strong>About Org:</strong> {form.aboutOrg}</p>
                  )}
                </>
              )}
            </div>

            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          /* EDIT MODE */
          <>
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
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />

                  <label>Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
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

                  <label>What does your organization do?</label>
                  <textarea
                    name="aboutOrg"
                    value={form.aboutOrg}
                    onChange={handleChange}
                  />
                </>
              )}
            </div>

            <div className="edit-actions">
            <button
    className="save-btn"
    onClick={() => {
      // Update displayed user data
      user.name = form.name;
      user.email = form.email;

      if (user.role === "freelancer") {
        user.age = form.age;
        user.gender = form.gender;
        user.city = form.city;
        user.experience = form.experience;
      }

      if (user.role === "client") {
        user.organization = form.organization;
        user.aboutOrg = form.aboutOrg;
      }

      setEditMode(false); // exit edit mode
    }}
  >
    Save
  </button>

  <button
    className="cancel-btn"
    onClick={() => {
      setEditMode(false);
    }}
  >
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
