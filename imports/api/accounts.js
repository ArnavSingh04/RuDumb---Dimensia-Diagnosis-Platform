import { Accounts } from "meteor/accounts-base";

Accounts.config({ forbidClientAccountCreation: false });

Accounts.onCreateUser((options, user) => {
  const role = options.profile?.role || "patient";
  user.profile = user.profile || {};
  user.profile.role = role;
  user.profile.name = options.profile?.name ?? "";
  user.profile.age = options.profile?.age ?? null;
  user.profile.sex = options.profile?.sex ?? "";
  user.profile.education = options.profile?.education ?? "";
  return user;
});
