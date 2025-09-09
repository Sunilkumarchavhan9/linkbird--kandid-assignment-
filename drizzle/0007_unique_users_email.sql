-- Ensure email is unique to satisfy auth invariants
ALTER TABLE "users"
  ADD CONSTRAINT "users_email_unique" UNIQUE ("email");


