import { useState } from "react";

export default function Login({ onLogin, onBack }) {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          💧
        </div>

        <h1>AquaGuard</h1>

        <p className="auth-subtitle">
          Community Water Monitoring Platform
        </p>

        <div className="auth-tabs">
          <button
            className={!isSignup ? "active-tab" : ""}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>

          <button
            className={isSignup ? "active-tab" : ""}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
        </div>

        {isSignup && (
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
            />
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <button
          className="auth-button"
          onClick={onLogin}
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>

    </div>
  );
}