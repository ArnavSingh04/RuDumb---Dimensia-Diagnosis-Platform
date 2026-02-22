import React from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { AssessmentsCollection } from "../../api/assessments";

export function PatientHome() {
  const userId = useTracker(() => Meteor.userId(), []);
  const draft = useTracker(
    () => AssessmentsCollection.findOne({ patientId: userId, status: "draft" }),
    [userId]
  );

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Patient dashboard</h1>
      <p style={{ marginBottom: 24 }}>Start a new cognitive triage assessment.</p>
      <Link
        to={draft ? "/intake" : "/demographics"}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#2563eb",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 8,
        }}
      >
        {draft ? "Continue assessment" : "Start assessment"}
      </Link>
    </div>
  );
}
