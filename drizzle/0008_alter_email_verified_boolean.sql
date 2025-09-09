-- Change users.email_verified to boolean to match auth insert
DO $$ BEGIN
  ALTER TABLE "users" ALTER COLUMN "email_verified" TYPE boolean USING (CASE WHEN email_verified IS NULL THEN NULL WHEN email_verified::text IN ('t','true','1') THEN true ELSE false END);
EXCEPTION WHEN others THEN
  BEGIN
    -- If column doesn't exist yet, add it
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" boolean;
  END;
END $$;


