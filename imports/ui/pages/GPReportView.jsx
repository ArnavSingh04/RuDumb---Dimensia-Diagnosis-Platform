import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AssessmentsCollection } from "../../api/assessments";
import { RiskBadge } from "../components/RiskBadge";

export function GPReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const assessment = useTracker(
    () => (id ? AssessmentsCollection.findOne(id) : null),
    [id]
  );

  useEffect(() => {
    if (assessment?.gpNotes != null) setNotes(assessment.gpNotes || "");
  }, [assessment?._id, assessment?.gpNotes]);

  const handleSaveNotes = () => {
    if (!id) return;
    setSaving(true);
    Meteor.call("assessments.gpAddNotes", { assessmentId: id, notes }, () => {
      setSaving(false);
    });
  };

  const handleMarkReviewed = () => {
    if (!id) return;
    Meteor.call("assessments.gpMarkReviewed", { assessmentId: id }, () => {
      navigate("/gp");
    });
  };

  if (!assessment) return <p>Loading…</p>;

  const vitals = assessment.vitals || {};
  const scores = assessment.cognitiveScores || {};

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/gp")}
        style={{ marginBottom: 24, padding: "8px 16px", cursor: "pointer" }}
      >
        ← Back to dashboard
      </button>
      <h1 style={{ marginBottom: 24 }}>Assessment report</h1>
      <p><strong>Patient:</strong> {assessment.patientName || "—"}</p>
      <p><strong>Submitted:</strong> {assessment.submittedAt ? new Date(assessment.submittedAt).toLocaleString() : "—"}</p>
      <div style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Risk tier</h2>
        <RiskBadge tier={assessment.riskTier} />
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
      <div style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>GP notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
        <button
          type="button"
          onClick={handleSaveNotes}
          disabled={saving}
          style={{ marginTop: 8, padding: "8px 16px", cursor: "pointer" }}
        >
          {saving ? "Saving…" : "Save notes"}
        </button>
      </div>
      {assessment.status === "submitted" && (
        <button
          type="button"
          onClick={handleMarkReviewed}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Mark as reviewed
        </button>
      )}
    </div>
  );
}
