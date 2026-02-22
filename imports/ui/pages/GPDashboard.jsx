import React from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { AssessmentsCollection } from "../../api/assessments";
import { RiskBadge } from "../components/RiskBadge";

export function GPDashboard() {
  const assessments = useTracker(() => {
    return AssessmentsCollection.find({ status: "submitted" }, { sort: { submittedAt: -1 } }).fetch();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>GP dashboard</h1>
      <p style={{ marginBottom: 24 }}>Submitted assessments</p>
      {assessments.length === 0 ? (
        <p style={{ color: "#666" }}>No submitted assessments.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
              <th style={{ padding: 12 }}>Patient</th>
              <th style={{ padding: 12 }}>Date</th>
              <th style={{ padding: 12 }}>Risk</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12 }}></th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>{a.patientName || "—"}</td>
                <td style={{ padding: 12 }}>
                  {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "—"}
                </td>
                <td style={{ padding: 12 }}>
                  <RiskBadge tier={a.riskTier} />
                </td>
                <td style={{ padding: 12 }}>{a.status}</td>
                <td style={{ padding: 12 }}>
                  <Link to={`/gp/report/${a._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
