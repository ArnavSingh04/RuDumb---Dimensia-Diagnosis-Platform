import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

export function Layout() {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user(), []);
  const role = user?.profile?.role;

  const handleLogout = () => {
    Meteor.logout(() => navigate("/login"));
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <Link to={role === "gp" ? "/gp" : "/"} style={{ color: "#111", textDecoration: "none", fontWeight: 700 }}>
          Dimensia Triage
        </Link>
        {user && (
          <span>
            <span style={{ marginRight: 12 }}>{user.profile?.name || user.emails?.[0]?.address}</span>
            <button type="button" onClick={handleLogout} style={{ padding: "6px 12px", cursor: "pointer" }}>
              Logout
            </button>
          </span>
        )}
      </header>
      <Outlet />
    </div>
  );
}
