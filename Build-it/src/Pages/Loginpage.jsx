import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { API } from "../api";
import { SolarCanvas } from "../fx";

function Loginpage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { setAuth } = useAuth();
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch(`${API}/login-page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      setAuth({ accessToken: data.accessToken, user: data.user });
      Navigate("/");
    } catch (err) {
      setError(err.message || "Failed to log in. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <SolarCanvas />
        <div style={{ position: "relative" }}>
          <span className="kicker"><span className="dot" /> WELCOME BACK, BUILDER</span>
          <h2>Your build missed <em>you.</em></h2>
          <p>Sign in to sync your cart, resume your PC build and check out with live prices.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form onSubmit={handleSubmit} className="auth-card">
          <h1>Sign in</h1>
          <p>Good builds start with a good login.</p>
          <div className="field">
            <label htmlFor="username">USERNAME</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="e.g. solarpunk_99" id="username" name="username" required />
          </div>
          <div className="field">
            <label htmlFor="password">PASSWORD</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" id="password" name="password" required />
          </div>
          <button type="submit" className="btn btn-solid btn-block" disabled={busy}>
            {busy ? "Signing in…" : <>Log in <i className="fa-solid fa-arrow-right" /></>}
          </button>
          {error && <p className="form-err">{error}</p>}
          <p className="switch-line">New to the workshop? <Link to="/register-page">Create an account</Link></p>
        </form>
      </div>
    </div>
  );
}
export default Loginpage;
