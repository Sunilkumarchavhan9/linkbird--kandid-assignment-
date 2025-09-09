-- Add password column to accounts for email/password flow
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "password" text;


