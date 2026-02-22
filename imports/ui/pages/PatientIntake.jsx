import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AssessmentsCollection } from "../../api/assessments";

const defaultVitals = {
  heartRate: "",
  systolicBP: "",
  diastolicBP: "",
  respiratoryRate: "",
  oxygenSaturation: "",
};

const defaultSymptomHistory = {
  headache: "",
  dizziness: "",
  confusion: "",
  other: "",
};

export function PatientIntake() {
  const [vitals, setVitals] = useState(defaultVitals);
  const [symptomHistory, setSymptomHistory] = useState(defaultSymptomHistory);
  const [assessmentId, setAssessmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = useTracker(() => Meteor.userId(), []);
  const draft = useTracker(
    () => AssessmentsCollection.findOne({ patientId: userId, status: "draft" }),
    [userId]
  );

  useEffect(() => {
    if (draft) {
      setAssessmentId(draft._id);
      if (draft.vitals) setVitals((v) => ({ ...defaultVitals, ...draft.vitals }));
      if (draft.symptomHistory) setSymptomHistory((s) => ({ ...defaultSymptomHistory, ...draft.symptomHistory }));
    } else if (userId && !draft) {
      Meteor.call("assessments.create", (err, id) => {
        if (!err && id) setAssessmentId(id);
      });
    }
  }, [userId, draft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assessmentId) return;
    setLoading(true);
    Meteor.call(
      "assessments.updateIntake",
      {
        assessmentId,
        vitals: Object.fromEntries(
          Object.entries(vitals).map(([k, v]) => [k, v === "" ? null : Number(v)])
        ),
        symptomHistory,
      },
      (err) => {
        setLoading(false);
        if (err) return;
        navigate("/cognitive-tests");
      }
    );
  };

  const updateVital = (key, value) => setVitals((v) => ({ ...v, [key]: value }));
  const updateSymptom = (key, value) => setSymptomHistory((s) => ({ ...s, [key]: value }));

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Assessment intake</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Vitals</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {["heartRate", "systolicBP", "diastolicBP", "respiratoryRate", "oxygenSaturation"].map((key) => (
            <div key={key}>
              <label style={{ display: "block", marginBottom: 4 }}>{key.replace(/([A-Z])/g, " $1").trim()}</label>
              <input
                type="number"
                value={vitals[key]}
                onChange={(e) => updateVital(key, e.target.value)}
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Symptom history</h2>
        {["headache", "dizziness", "confusion", "other"].map((key) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>{key}</label>
            <input
              type="text"
              value={symptomHistory[key]}
              onChange={(e) => updateSymptom(key, e.target.value)}
              style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            />
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
            {loading ? "Saving…" : "Continue to cognitive tests"}
          </button>
        </div>
      </form>
    </div>
  );
}
