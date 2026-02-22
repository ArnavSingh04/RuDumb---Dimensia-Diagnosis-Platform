import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PatientHome } from "./pages/PatientHome";
import { PatientDemographics } from "./pages/PatientDemographics";
import { PatientIntake } from "./pages/PatientIntake";
import { PatientCognitiveTests } from "./pages/PatientCognitiveTests";
import { PatientReport } from "./pages/PatientReport";
import { GPDashboard } from "./pages/GPDashboard";
import { GPReportView } from "./pages/GPReportView";

function Subscribe() {
  const user = useTracker(() => Meteor.user(), []);
  useTracker(() => {
    if (!user) return;
    Meteor.subscribe("users.profile");
    if (user.profile?.role === "patient") Meteor.subscribe("assessments.my");
    if (user.profile?.role === "gp") Meteor.subscribe("assessments.submitted");
    return null;
  }, [user?._id, user?.profile?.role]);
  return null;
}

function ProtectedPatient({ children }) {
  const user = useTracker(() => Meteor.user(), []);
  const loading = useTracker(() => Meteor.loggingIn(), []);
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.profile?.role !== "patient") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ProtectedGP({ children }) {
  const user = useTracker(() => Meteor.user(), []);
  const loading = useTracker(() => Meteor.loggingIn(), []);
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.profile?.role !== "gp") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GPReportViewWithSub() {
  const { id } = useParams();
  useTracker(() => (id ? Meteor.subscribe("assessments.one", id) : null), [id]);
  return <GPReportView />;
}

export function App() {
  return (
    <BrowserRouter>
      <Subscribe />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedPatient><PatientHome /></ProtectedPatient>} />
          <Route path="demographics" element={<ProtectedPatient><PatientDemographics /></ProtectedPatient>} />
          <Route path="intake" element={<ProtectedPatient><PatientIntake /></ProtectedPatient>} />
          <Route path="cognitive-tests" element={<ProtectedPatient><PatientCognitiveTests /></ProtectedPatient>} />
          <Route path="report" element={<ProtectedPatient><PatientReport /></ProtectedPatient>} />
          <Route path="gp" element={<ProtectedGP><GPDashboard /></ProtectedGP>} />
          <Route path="gp/report/:id" element={<ProtectedGP><GPReportViewWithSub /></ProtectedGP>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
