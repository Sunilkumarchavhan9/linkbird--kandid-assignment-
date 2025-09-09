import { config as loadEnv } from 'dotenv'
import { neon } from '@neondatabase/serverless'

loadEnv({ path: '.env.local', override: true })
loadEnv()

const url = process.env.DATABASE_URL!

async function main() {
  if (!url) throw new Error('DATABASE_URL is not set')
  const sql = neon(url)
  // Try to change type to boolean; if column missing, add it.
  try {
    await sql`ALTER TABLE "users" ALTER COLUMN "email_verified" TYPE boolean USING (CASE WHEN "email_verified"::text IN ('t','true','1') THEN true ELSE false END)`
  } catch (e: any) {
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" boolean`
  }
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' ORDER BY ordinal_position;` as any
  console.log('users columns:', cols.map((c: any) => `${c.column_name}:${c.data_type}`).join(', '))
}

main().catch((e) => { console.error(e); process.exit(1) })
