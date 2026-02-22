import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    Accounts.createUser(
      { email, password, profile: { role: "patient" } },
      (err) => {
        if (err) {
          setError(err.reason || "Registration failed");
          return;
        }
        navigate("/");
      }
    );
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h1 style={{ marginBottom: 24 }}>Register (Patient)</h1>
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
          Register
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        <Link to="/login">Already have an account? Sign in</Link>
      </p>
    </div>
  );
}
