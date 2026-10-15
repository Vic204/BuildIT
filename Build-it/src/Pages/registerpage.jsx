import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";
import { SolarCanvas } from "../fx";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch(`${API}/register-page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Register failed");
      setMessage(data.message + " — now sign in.");
      setTimeout(() => Navigate("/login-page"), 900);
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <SolarCanvas />
        <div style={{ position: "relative" }}>
          <span className="kicker"><span className="dot" /> JOIN THE WORKSHOP</span>
          <h2>Grab your <em>toolbox.</em></h2>
          <p>One account for carts, orders and build history. Passwords are hashed with bcrypt — never stored raw.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form onSubmit={handleSubmit} className="auth-card">
          <h1>Create account</h1>
          <p>Takes 20 seconds. Measure twice, click once.</p>
          <div className="field">
            <label htmlFor="username">USERNAME</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Pick a username" id="username" name="username" required />
          </div>
          <div className="field">
            <label htmlFor="email">EMAIL</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" id="email" name="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">PASSWORD</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Min. 6 characters" id="password" name="password" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-solid btn-block" disabled={busy}>
            {busy ? "Creating…" : <>Sign up <i className="fa-solid fa-user-plus" /></>}
          </button>
          {error && <p className="form-err">{error}</p>}
          {message && <p className="form-ok">{message}</p>}
          <p className="switch-line">Already have an account? <Link to="/login-page">Log in</Link></p>
        </form>
      </div>
    </div>
  );
}
