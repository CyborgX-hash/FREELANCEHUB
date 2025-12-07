import React, { useState } from "react";
import { signupUser, loginUser } from "../api";
import "./SignupForm.css";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "role") {
      formattedValue = value === "Client" ? "client" : "freelancer";
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password)
      return setMessage("Passwords do not match");

    if (!formData.role)
      return setMessage("Please select a role");

    const result = await signupUser(formData);

    // ⭐ CHECK FOR TOKEN (Backend now returns token)
    if (result.token) {
      localStorage.setItem("token", result.token);

      // Notify homepage that token changed
      window.dispatchEvent(new Event("tokenChanged"));

      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);
      return;
    }

    // If backend didn't return token (fallback auto-login)
    const loginRes = await loginUser({
      email: formData.email,
      password: formData.password
    });

    if (loginRes.token) {
      localStorage.setItem("token", loginRes.token);
      window.dispatchEvent(new Event("tokenChanged"));
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);
    } else {
      setMessage(result.ERROR || "Something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create your account</h2>
        <p className="subtitle">Join FreelanceHub and start your journey.</p>

        <div className="role-selector">
          <label>
            <input type="radio" name="role" value="Client" onChange={handleChange}/> Client
          </label>

          <label>
            <input type="radio" name="role" value="Freelancer" onChange={handleChange}/> Freelancer
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} required />

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
