import { config as loadEnv } from 'dotenv'
import { neon } from '@neondatabase/serverless'

loadEnv({ path: '.env.local', override: true })
loadEnv()

const url = process.env.DATABASE_URL!

async function main() {
  if (!url) throw new Error('DATABASE_URL is not set')
  const sql = neon(url)
  await sql`ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "password" text`
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'accounts' ORDER BY ordinal_position;` as any
  console.log('accounts columns:', cols.map((c: any) => c.column_name).join(', '))
}

main().catch((e) => { console.error(e); process.exit(1) })
