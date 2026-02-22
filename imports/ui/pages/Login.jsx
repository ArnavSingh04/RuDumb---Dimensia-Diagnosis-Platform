import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason || "Login failed");
        return;
      }
      const user = Meteor.user();
      if (user?.profile?.role === "gp") navigate("/gp");
      else navigate("/");
    });
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h1 style={{ marginBottom: 24 }}>Sign in</h1>
      {error && <p style={{ color: "#dc2626", marginBottom: 12 }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer", width: "100%" }}>
          Sign in
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        <Link to="/register">Register as patient</Link>
      </p>
    </div>
  );
}
