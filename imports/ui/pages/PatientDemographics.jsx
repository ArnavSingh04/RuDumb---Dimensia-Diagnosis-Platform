import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

export function PatientDemographics() {
  const user = useTracker(() => Meteor.user(), []);
  const [name, setName] = useState(user?.profile?.name ?? "");
  const [age, setAge] = useState(user?.profile?.age ?? "");
  const [sex, setSex] = useState(user?.profile?.sex ?? "");
  const [education, setEducation] = useState(user?.profile?.education ?? "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    Meteor.call("assessments.updateDemographics", {
      name: name.trim(),
      age: Number(age),
      sex: sex.trim(),
      education: education.trim(),
    }, (err) => {
      setLoading(false);
      if (err) return;
      navigate("/intake");
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Demographic details</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Age</label>
          <input
            type="number"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Sex</label>
          <input
            type="text"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            placeholder="e.g. Male, Female, Other"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Education</label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g. High school, Bachelor's"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {loading ? "Saving…" : "Continue to intake"}
        </button>
      </form>
    </div>
  );
}
