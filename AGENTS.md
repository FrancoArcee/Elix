# Elix Fragancias — Project Context for AI Agents

## Project Overview

Perfume catalog for a small business. Customers browse products, promos, and business info. Admins manage everything via a shared admin panel.

## Architecture

Single service:

```
Elix/
├── App/          # Next.js (App Router, API Routes, Tailwind, Zustand, Prisma)
└── docker-compose.yml
```

| Component   | Port | Technology                          |
|-------------|------|-------------------------------------|
| App + API   | 3000 | Next.js 15, Tailwind, Zustand       |
| Database    | 5432 | PostgreSQL 16 + Prisma ORM          |
| Images      | —    | Cloudflare R2 (S3-compatible)       |

## App (Next.js)

### Directory Structure

```
App/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/               # better-auth catch-all
│   │   │   │   └── [...all]/route.ts
│   │   │   ├── health/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── products/[id]/route.ts
│   │   │   ├── promos/route.ts
│   │   │   └── admin/
│   │   │       ├── products/route.ts
│   │   │       ├── products/[id]/route.ts
│   │   │       ├── promos/route.ts
│   │   │       ├── promos/[id]/route.ts
│   │   │       └── upload/route.ts
│   │   ├── (auth)/login/page.tsx
│   │   ├── admin/
│   │   ├── cart/page.tsx
│   │   ├── products/
│   │   ├── nosotros/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/{domain}/
│   ├── context/store.ts           # Zustand stores
│   ├── hooks/
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # better-auth server config
│   │   ├── auth-client.ts         # better-auth React client
│   │   ├── admin.ts               # getAdminSession() helper
│   │   └── r2.ts                  # Cloudflare R2 client
│   ├── middleware.ts              # Route protection (session cookie)
│   ├── services/                  # Frontend fetch helpers
│   └── utils/
├── .env.dev
├── Dockerfile
├── package.json
└── next.config.js
```

### Conventions

- **Routing**: Next.js App Router with route groups `(auth)`, dynamic routes `[id]`
- **State**: Zustand stores in `src/context/`
- **Styling**: Tailwind CSS utility classes
- **API calls (client)**: Service layer in `src/services/`
- **API calls (server)**: Direct Prisma queries in API Routes
- **Components**: `src/components/` organized by domain
- **Lib**: Shared utilities in `src/lib/` (prisma, auth, r2)
- **Auth**: better-auth (email/password), single admin user seeded via `prisma/seed.js` (`ADMIN_EMAIL`/`ADMIN_PASSWORD` en vars), role check via `getAdminSession()` in `src/lib/admin.ts`
- **Images**: Uploaded to Cloudflare R2, URLs stored in DB

## Code Style

- TypeScript, functional components, no class components
- No comments in production code
- Variables and functions in English; business names in Spanish

## Development

```bash
docker compose up --build
```

Frontend + API: `http://localhost:3000`
Database: `localhost:5432`

## Environment Variables

- `App/.env.dev` — DATABASE_URL, BETTER_AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, R2 credentials
