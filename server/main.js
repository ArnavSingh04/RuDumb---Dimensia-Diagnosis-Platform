import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "../imports/api/assessmentsPublications";
import "../imports/api/assessmentsMethods";
import "../imports/api/accounts";

Meteor.startup(() => {
  const gp = Meteor.users.findOne({ "profile.role": "gp" });
  if (!gp) {
    Accounts.createUser({
      email: "gp@example.com",
      password: "gp123",
      profile: { role: "gp", name: "Demo GP" },
    });
  }
});
