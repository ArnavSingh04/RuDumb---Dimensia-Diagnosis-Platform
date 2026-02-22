import React from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AssessmentsCollection } from "../../api/assessments";
import { RiskBadge } from "../components/RiskBadge";

export function PatientReport() {
  const navigate = useNavigate();
  const userId = useTracker(() => Meteor.userId(), []);
  const draft = useTracker(
    () => AssessmentsCollection.findOne({ patientId: userId, status: "draft" }),
    [userId]
  );

  const handleSubmitToGP = () => {
    if (!draft?._id) return;
    Meteor.call("assessments.submitToGP", { assessmentId: draft._id }, (err) => {
      if (!err) navigate("/");
    });
  };

  if (!draft) return <p>Loading…</p>;

  const vitals = draft.vitals || {};
  const scores = draft.cognitiveScores || {};
  const tier = draft.riskTier || "low";

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Assessment report</h1>
      <div style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Risk tier</h2>
        <RiskBadge tier={tier} />
      </div>
      <div style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Vitals</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Object.entries(vitals).map(([k, v]) => (
            <li key={k}>{k.replace(/([A-Z])/g, " $1").trim()}: {v != null ? v : "—"}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Cognitive scores (mock)</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Object.entries(scores).map(([k, v]) => (
            <li key={k}>{k}: {v}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={handleSubmitToGP}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Submit report to GP
        </button>
      </div>
    </div>
  );
}
