import React, { useState } from "react";
import { loginUser } from "../api";
import "./LoginForm.css";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(credentials);

    if (result.token) {
      localStorage.setItem("token", result.token);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } else {
      setMessage(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to FreelanceHub and continue your journey 🚀</p>

        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="switch">
          Don’t have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
