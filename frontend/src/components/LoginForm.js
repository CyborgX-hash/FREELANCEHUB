import React, { useState } from "react";
import { loginUser } from "../api";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await loginUser(credentials);

    if (result.token) {
      localStorage.setItem("token", result.token);
      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");  
      }, 1200);

    } else {
      setMessage(result.ERROR || result.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to FreelanceHub and continue your journey.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? <div className="loader light"></div> : "Login"}
          </button>
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
