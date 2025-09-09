import { config as loadEnv } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

// Load from .env (single source of truth)
loadEnv({ path: '.env', override: true })

const url = process.env.DATABASE_URL!;
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

async function main() {
  const client = neon(url)
  const db = drizzle(client)
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('Migrations applied successfully over HTTP')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
