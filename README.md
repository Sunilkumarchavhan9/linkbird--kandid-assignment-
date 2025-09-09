## Kandid Assignment – Linkbird CRM

Next.js 15 App Router app using Tailwind CSS v4 + shadcn/ui, Better Auth, Drizzle ORM, TanStack Query, and Zustand.

### Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS v4 + shadcn/ui
- PostgreSQL + Drizzle ORM (via `@vercel/postgres`)
- Better Auth (credentials + Google)
- TanStack Query (React Query)
- Zustand

---

## 1) Setup

### Prerequisites
- Node 18+
- A Postgres database URL (Vercel PostgreSQL or any Postgres)

### Environment
Copy and fill environment variables:
```bash
cp env.example .env.local
```
Required vars:
- `BETTER_AUTH_SECRET` – generate: `npx @better-auth/cli@latest secret`
- `BETTER_AUTH_URL` – e.g. `http://localhost:3000`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – from Google Cloud console
- `DATABASE_URL` – Postgres connection string

### Install
```bash
npm i
```

### DB: Generate and Push
```bash
npm run db:generate
npm run db:migrate
```

### Develop
```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## 2) Project Structure
Key paths:
- `app/providers.tsx` – Theme + React Query providers
- `lib/db/schema.ts` – Drizzle schema (campaigns, leads)
- `lib/db/client.ts` – Drizzle client using `@vercel/postgres`
- `lib/auth/server.ts` – Better Auth server config
- `app/api/auth/[...all]/route.ts` – Better Auth handler
- `lib/auth/client.ts` – Better Auth React client
- `middleware.ts` – Route protection for app routes
- `(app) shell`:
  - `components/shell/{Sidebar,Header,Breadcrumbs}.tsx`
  - `app/(app)/layout.tsx`
  - `app/(app)/dashboard/page.tsx`
- Leads:
  - `app/api/leads/route.ts`, `app/api/leads/[id]/route.ts`
  - `components/leads/LeadsTable.tsx`
  - `app/(app)/leads/page.tsx`
- Campaigns:
  - `app/api/campaigns/route.ts`
  - `components/campaigns/CampaignsTable.tsx`
  - `app/(app)/campaigns/page.tsx`

---

## 3) Authentication
- Credentials and Google OAuth via Better Auth
- API mounted under `/api/auth/*`
- Middleware guards `/dashboard`, `/leads`, `/campaigns`, `/settings` and redirects to `/login`
- Basic login page at `/login`

Common actions:
```ts
// Sign in with email
await authClient.signIn.email({ email, password, callbackURL: "/dashboard" });

// Sign in with Google
await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });

// Sign out
await authClient.signOut();
```

---

## 4) Database Schema (Drizzle)

Tables:
- `campaigns`:
  - id (serial PK)
  - name (text)
  - status (enum: draft, active, paused, completed)
  - totalLeads (int)
  - successfulLeads (int)
  - createdAt (timestamptz)

- `leads`:
  - id (serial PK)
  - name (text)
  - email (text)
  - company (text|null)
  - campaignId (FK -> campaigns.id)
  - status (enum: pending, contacted, responded, converted)
  - lastContactAt (timestamptz|null)
  - createdAt (timestamptz)

Migration scripts:
```bash
npm run db:generate
npm run db:migrate
```

---

## 5) API Endpoints

### Auth
- `GET|POST /api/auth/[...all]` – Better Auth handler

### Leads
- `GET /api/leads?limit=20&cursor=ID&search=...&status=...&campaignId=...`
  - Returns `{ items: LeadListItem[], nextCursor: number|null }`
- `GET /api/leads/:id` – lead details

### Campaigns
- `GET /api/campaigns?search=...&status=...&sort=createdAt|name|successRate&order=asc|desc`
  - Returns `{ items: CampaignListItem[] }`

---

## 6) UI/UX
- App shell with collapsible sidebar, header, breadcrumbs
- Leads: infinite scroll table, search + status filters
- Campaigns: table with status filters, sorting, progress bars
- Dark/light theme via `next-themes`

---

## 7) Deployment (Vercel)
1. Push repository to GitHub
2. Import project in Vercel
3. Set env vars in Vercel Project Settings → Environment Variables
   - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your prod URL), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DATABASE_URL`
4. If using Vercel Postgres, link database and set `DATABASE_URL`
5. Trigger deploy
6. After first deploy, run migrations (from local or CI):
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

---

## 8) Scripts
```bash
npm run dev          # start dev server
npm run build        # build
npm run start        # start production server
npm run db:generate  # generate drizzle SQL
npm run db:migrate   # push drizzle schema
```

