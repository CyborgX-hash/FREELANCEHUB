import React, { useState } from "react";
import { sendSignupOtp, signupUser } from "../api";
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

  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("DETAILS"); // "DETAILS" | "VERIFY"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessMsg, setIsSuccessMsg] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "role") {
      formattedValue = value === "Client" ? "client" : "freelancer";
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setIsSuccessMsg(false);
      return setMessage("Passwords do not match");
    }

    if (!formData.role) {
      setIsSuccessMsg(false);
      return setMessage("Please select a role (Client or Freelancer)");
    }

    setLoading(true);
    setMessage("");

    const res = await sendSignupOtp(formData);

    setLoading(false);

    if (res?.ERROR) {
      setIsSuccessMsg(false);
      setMessage(res.ERROR);
    } else {
      setIsSuccessMsg(true);
      setMessage(res.message || `Verification code sent to ${formData.email}`);
      setStep("VERIFY");
    }
  };

  // Step 2: Verify OTP & complete registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setIsSuccessMsg(false);
      return setMessage("Please enter the 6-digit verification code sent to your email.");
    }

    setLoading(true);
    setMessage("");

    const result = await signupUser({
      ...formData,
      otpCode: otpCode.trim(),
    });

    if (result.token) {
      localStorage.setItem("token", result.token);
      window.dispatchEvent(new Event("tokenChanged"));

      setIsSuccessMsg(true);
      setMessage("Email verified & account registered successfully! Redirecting...");
      setTimeout(() => navigate("/"), 800);
      return;
    }

    setIsSuccessMsg(false);
    setMessage(result.ERROR || "Failed to verify email code");
    setLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    const res = await sendSignupOtp(formData);
    setLoading(false);

    if (res?.ERROR) {
      setIsSuccessMsg(false);
      setMessage(res.ERROR);
    } else {
      setIsSuccessMsg(true);
      setMessage(`New verification code sent to ${formData.email}!`);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create your account</h2>
        <p className="subtitle">
          {step === "DETAILS"
            ? "Join FreelanceHub and start your journey."
            : "Verify your email to complete registration."}
        </p>

        {step === "DETAILS" ? (
          <>
            <div className="role-selector">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Client"
                  checked={formData.role === "client"}
                  onChange={handleChange}
                />{" "}
                Client
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="Freelancer"
                  checked={formData.role === "freelancer"}
                  onChange={handleChange}
                />{" "}
                Freelancer
              </label>
            </div>

            <form onSubmit={handleSendOtp}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={loading} className="send-otp-btn">
                {loading ? <div className="loader light"></div> : "📧 Send Email Verification Code"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="otp-form">
            <div className="otp-info">
              <p>
                We sent a 6-digit code to:
                <br />
                <strong className="email-highlight">{formData.email}</strong>
              </p>
            </div>

            <input
              type="text"
              name="otpCode"
              placeholder="Enter 6-digit OTP"
              value={otpCode}
              maxLength={6}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              className="otp-input"
              required
              autoFocus
            />

            <button type="submit" disabled={loading} className="verify-btn">
              {loading ? <div className="loader light"></div> : "✅ Verify Email & Register"}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                className="text-btn"
                onClick={handleResendOtp}
                disabled={loading}
              >
                🔄 Resend Code
              </button>

              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  setStep("DETAILS");
                  setMessage("");
                }}
              >
                ✏️ Change Email
              </button>
            </div>
          </form>
        )}

        {message && (
          <p className={`message ${isSuccessMsg ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <p className="switch">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
