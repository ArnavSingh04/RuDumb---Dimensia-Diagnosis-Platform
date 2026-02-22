import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { AssessmentsCollection } from "./assessments";
import { calculateRiskTier } from "../lib/scoring";

Meteor.methods({
  "assessments.create"() {
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    const user = Meteor.users.findOne(this.userId());
    if (user?.profile?.role !== "patient") throw new Meteor.Error("not-authorized");
    return AssessmentsCollection.insert({
      patientId: this.userId(),
      status: "draft",
      createdAt: new Date(),
      vitals: null,
      symptomHistory: null,
      cognitiveScores: {},
      riskTier: null,
      submittedAt: null,
      gpNotes: null,
      reviewedAt: null,
    });
  },

  "assessments.updateDemographics"({ name, age, sex, education }) {
    check(name, String);
    check(age, Number);
    check(sex, String);
    check(education, String);
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    Meteor.users.update(this.userId(), {
      $set: {
        "profile.name": name,
        "profile.age": age,
        "profile.sex": sex,
        "profile.education": education,
      },
    });
  },

  "assessments.updateIntake"({ assessmentId, vitals, symptomHistory }) {
    check(assessmentId, String);
    check(vitals, Object);
    check(symptomHistory, Object);
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    const a = AssessmentsCollection.findOne(assessmentId);
    if (!a || a.patientId !== this.userId() || a.status !== "draft") {
      throw new Meteor.Error("not-found");
    }
    AssessmentsCollection.update(assessmentId, {
      $set: { vitals, symptomHistory },
    });
  },

  "assessments.runMockTest"({ assessmentId, testKey }) {
    check(assessmentId, String);
    check(testKey, String);
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    const a = AssessmentsCollection.findOne(assessmentId);
    if (!a || a.patientId !== this.userId() || a.status !== "draft") {
      throw new Meteor.Error("not-found");
    }
    const mockScore = Math.floor(Math.random() * 40) + 50;
    const cognitiveScores = { ...(a.cognitiveScores || {}), [testKey]: mockScore };
    const updated = { ...a, cognitiveScores, vitals: a.vitals };
    const riskTier = calculateRiskTier(updated);
    AssessmentsCollection.update(assessmentId, {
      $set: { cognitiveScores: cognitiveScores, riskTier },
    });
    return mockScore;
  },

  "assessments.finalizeReport"({ assessmentId }) {
    check(assessmentId, String);
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    const a = AssessmentsCollection.findOne(assessmentId);
    if (!a || a.patientId !== this.userId() || a.status !== "draft") {
      throw new Meteor.Error("not-found");
    }
    const riskTier = calculateRiskTier(a);
    AssessmentsCollection.update(assessmentId, {
      $set: { riskTier },
    });
    return riskTier;
  },

  "assessments.submitToGP"({ assessmentId }) {
    check(assessmentId, String);
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    const a = AssessmentsCollection.findOne(assessmentId);
    if (!a || a.patientId !== this.userId() || a.status !== "draft") {
      throw new Meteor.Error("not-found");
    }
    const user = Meteor.users.findOne(this.userId());
    const patientName = user?.profile?.name || "Patient";
    const riskTier = calculateRiskTier(a);
    AssessmentsCollection.update(assessmentId, {
      $set: {
        status: "submitted",
        submittedAt: new Date(),
        riskTier,
        patientName,
      },
    });
  },

  "assessments.gpAddNotes"({ assessmentId, notes }) {
    check(assessmentId, String);
    check(notes, String);
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    const user = Meteor.users.findOne(this.userId());
    if (user?.profile?.role !== "gp") throw new Meteor.Error("not-authorized");
    const a = AssessmentsCollection.findOne(assessmentId);
    if (!a || a.status !== "submitted") throw new Meteor.Error("not-found");
    AssessmentsCollection.update(assessmentId, {
      $set: { gpNotes: notes },
    });
  },

  "assessments.gpMarkReviewed"({ assessmentId }) {
    check(assessmentId, String);
    if (!this.userId()) throw new Meteor.Error("not-authorized");
    const user = Meteor.users.findOne(this.userId());
    if (user?.profile?.role !== "gp") throw new Meteor.Error("not-authorized");
    const a = AssessmentsCollection.findOne(assessmentId);
    if (!a || a.status !== "submitted") throw new Meteor.Error("not-found");
    AssessmentsCollection.update(assessmentId, {
      $set: { status: "reviewed", reviewedAt: new Date() },
    });
  },
});
