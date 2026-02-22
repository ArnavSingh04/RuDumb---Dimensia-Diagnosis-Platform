import { Meteor } from "meteor/meteor";
import { AssessmentsCollection } from "./assessments";

Meteor.publish("assessments.my", function () {
  if (!this.userId()) return this.ready();
  const user = Meteor.users.findOne(this.userId());
  const role = user?.profile?.role;
  if (role === "patient") {
    return AssessmentsCollection.find({ patientId: this.userId() });
  }
  return this.ready();
});

Meteor.publish("assessments.submitted", function () {
  if (!this.userId()) return this.ready();
  const user = Meteor.users.findOne(this.userId());
  if (user?.profile?.role !== "gp") return this.ready();
  return AssessmentsCollection.find({ status: "submitted" });
});

Meteor.publish("assessments.one", function (assessmentId) {
  if (!this.userId() || !assessmentId) return this.ready();
  const user = Meteor.users.findOne(this.userId());
  const role = user?.profile?.role;
  if (role === "patient") {
    return AssessmentsCollection.find({
      _id: assessmentId,
      patientId: this.userId(),
    });
  }
  if (role === "gp") {
    return AssessmentsCollection.find({
      _id: assessmentId,
      status: "submitted",
    });
  }
  return this.ready();
});

Meteor.publish("users.profile", function () {
  if (!this.userId()) return this.ready();
  return Meteor.users.find(
    { _id: this.userId() },
    { fields: { profile: 1, emails: 1 } }
  );
});
