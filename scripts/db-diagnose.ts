import { config as loadEnv } from 'dotenv'
import { neon } from '@neondatabase/serverless'

loadEnv({ path: '.env.local', override: true })
loadEnv()

const url = process.env.DATABASE_URL!

async function main() {
  console.log('DATABASE_URL =', url)
  if (!url) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }
  const sql = neon(url)
  const dbInfo = await sql`
    SELECT current_database(), version();
  ` as any
  console.log('DB:', dbInfo[0]?.current_database)
  console.log('Version:', String(dbInfo[0]?.version).slice(0, 40) + '...')

  const cols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
    ORDER BY ordinal_position;
  ` as any
  console.log('users columns:', cols.map((c: any) => c.column_name).join(', '))
}

main().catch((e) => { console.error(e); process.exit(1) })
