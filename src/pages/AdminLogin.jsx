import { useState } from "react";

export default function AdminLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      setError("");
      onLogin();
    } else {
      setError("Invalid admin username or password");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-icon">👮</div>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Authorized personnel only
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-login-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="admin-login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
          >
            🔐 Login as Admin
          </button>

        </form>

        <button
          type="button"
          className="admin-login-back"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
}