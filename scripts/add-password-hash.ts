import { config as loadEnv } from 'dotenv'
import { neon } from '@neondatabase/serverless'

loadEnv({ path: '.env.local', override: true })
loadEnv()

const url = process.env.DATABASE_URL!
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

async function main() {
  const sql = neon(url)
  await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text`;
  const cols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
  `
  console.log('users columns:', cols.map((c: any) => c.column_name).join(', '))
}

main().catch((e) => { console.error(e); process.exit(1) })