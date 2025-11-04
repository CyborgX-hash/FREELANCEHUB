import React, { useState } from "react";
import { loginUser } from "../api";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(formData);

    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      setMessage(result.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
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
      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: "350px",
    margin: "40px auto",
    textAlign: "center",
    background: "#f2f2f2",
    padding: "20px",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default LoginForm;
