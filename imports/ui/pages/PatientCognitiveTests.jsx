import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AssessmentsCollection } from "../../api/assessments";

const MOCK_TESTS = [
  { key: "verbalFluency", label: "Verbal Fluency Test" },
  { key: "memoryTest", label: "Memory Test" },
];

export function PatientCognitiveTests() {
  const [running, setRunning] = useState(null);
  const navigate = useNavigate();
  const userId = useTracker(() => Meteor.userId(), []);
  const draft = useTracker(
    () => AssessmentsCollection.findOne({ patientId: userId, status: "draft" }),
    [userId]
  );

  useEffect(() => {
    if (userId && !draft) {
      Meteor.call("assessments.create");
    }
  }, [userId, draft]);

  const runTest = (testKey) => {
    if (!draft?._id) return;
    setRunning(testKey);
    Meteor.call("assessments.runMockTest", { assessmentId: draft._id, testKey }, (err, score) => {
      setRunning(null);
    });
  };

  const goToReport = () => {
    if (!draft?._id) return;
    Meteor.call("assessments.finalizeReport", { assessmentId: draft._id }, () => {
      navigate("/report");
    });
  };

  if (!draft) return <p>Loading…</p>;

  const scores = draft.cognitiveScores || {};

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Cognitive tests (placeholder)</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Mock tests only. Run each to generate a placeholder score.
      </p>
      <div style={{ marginBottom: 24 }}>
        {MOCK_TESTS.map(({ key, label }) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
          >
            <span style={{ flex: 1 }}>{label}</span>
            {scores[key] != null ? (
              <span style={{ fontWeight: 600 }}>Score: {scores[key]}</span>
            ) : (
              <button
                type="button"
                onClick={() => runTest(key)}
                disabled={running !== null}
                style={{ padding: "8px 16px", cursor: "pointer" }}
              >
                {running === key ? "Running…" : "Run test"}
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={goToReport}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        View report
      </button>
    </div>
  );
}
