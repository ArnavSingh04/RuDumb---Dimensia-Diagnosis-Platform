import React from "react";

const styles = {
  low: { backgroundColor: "#2563eb", color: "#fff" },
  moderate: { backgroundColor: "#ea580c", color: "#fff" },
  high: { backgroundColor: "#dc2626", color: "#fff" },
};

export function RiskBadge({ tier }) {
  const s = styles[tier] || styles.low;
  const label = tier ? String(tier).charAt(0).toUpperCase() + String(tier).slice(1) : "—";
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 600,
        ...s,
      }}
    >
      {label}
    </span>
  );
}
