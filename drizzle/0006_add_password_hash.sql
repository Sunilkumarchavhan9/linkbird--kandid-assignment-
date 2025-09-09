-- Add password hash column for email/password auth
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "password_hash" text;
