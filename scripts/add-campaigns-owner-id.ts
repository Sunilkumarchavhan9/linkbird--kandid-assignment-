import { config as loadEnv } from 'dotenv'
import { neon } from '@neondatabase/serverless'

loadEnv({ path: '.env', override: true })

const url = process.env.DATABASE_URL!
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

async function main() {
  const sql = neon(url)
  await sql`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "owner_id" text;`
  await sql`CREATE INDEX IF NOT EXISTS "campaigns_owner_id_idx" ON "campaigns" ("owner_id");`
  console.log('Ensured campaigns.owner_id and index exist')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


