import { config as loadEnv } from 'dotenv'
import { neon } from '@neondatabase/serverless'

loadEnv({ path: '.env', override: true })

const url = process.env.DATABASE_URL!
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const COUNT = Math.max(500, Math.min(Number(process.argv[2] ?? 650), 2000))
const OWNER_ID = process.argv[3] || null

function rnd(max: number) { return Math.floor(Math.random() * max) }

async function main() {
  const sql = neon(url)
  const statuses = ['draft','active','paused','completed'] as const

  const now = new Date()
  const rows: Array<{ name: string; status: string; owner_id: string|null; total_leads: number; successful_leads: number; created_at: string }>=[]
  for (let i = 0; i < COUNT; i++) {
    const idx = i + 1
    const name = `Campaign ${idx.toString().padStart(3,'0')}`
    const status = statuses[rnd(statuses.length)]
    const total = rnd(120) + 1
    const success = rnd(total + 1)
    const pastDays = rnd(180)
    const dt = new Date(now.getTime() - pastDays * 86400000)
    rows.push({
      name,
      status,
      owner_id: OWNER_ID,
      total_leads: total,
      successful_leads: success,
      created_at: dt.toISOString(),
    })
  }

  // Insert rows sequentially for reliability across providers
  for (const r of rows) {
    await sql`
      insert into "campaigns" ("name","status","owner_id","total_leads","successful_leads","created_at")
      values (${r.name}, ${r.status}::campaign_status, ${r.owner_id}, ${r.total_leads}, ${r.successful_leads}, ${r.created_at}::timestamptz)
    `
  }

  console.log(`Inserted ${rows.length} campaigns${OWNER_ID ? ` for owner ${OWNER_ID}` : ''}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


