-- Add owner_id to campaigns for user scoping
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "owner_id" text;

-- Create index to speed up per-user filters
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'campaigns_owner_id_idx' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX "campaigns_owner_id_idx" ON "campaigns" ("owner_id");
    END IF;
END $$;


