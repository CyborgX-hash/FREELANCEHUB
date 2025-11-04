import React, { useState } from "react";
import { signupUser } from "../api";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Client",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signupUser(formData);
  
    if (result.message === "Signup successful") {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } else {
      setMessage(result.message || "Something went wrong");
    }
  };
  
  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
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
        <select name="role" onChange={handleChange}>
          <option value="Client">Client</option>
          <option value="Freelancer">Freelancer</option>
        </select>
        <button type="submit">Signup</button>
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

export default SignupForm;
