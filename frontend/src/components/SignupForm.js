import React, { useState } from "react";
import { signupUser } from "../api";
import "./SignupForm.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "role") {
      formattedValue =
        value === "Client"
          ? "USER"
          : value === "Freelancer"
          ? "Freelancer"
          : value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signupUser(formData);

    if (result.message === "User registered successfully") {
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } else {
      setMessage(result.ERROR || result.message || "Something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create your account</h2>
        <p className="subtitle">Join FreelanceHub and start your journey.</p>

        {/* USER TYPE SELECTION */}
        <div className="role-selector">
          <label>
            <input
              type="radio"
              name="role"
              value="Client"
              onChange={handleChange}
            />
            Client
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Freelancer"
              onChange={handleChange}
            />
            Freelancer
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="switch">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
