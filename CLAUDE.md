# CLAUDE.md — CertifyHub

This file provides context for Claude Code when working on this project.

## Project Overview

CertifyHub is a multi-tenant GRC (Governance, Risk & Compliance) platform for managing certification journeys across 10 compliance frameworks. Built with Next.js 16 App Router, Prisma, PostgreSQL, and NextAuth v5.

## Tech Stack

- **Next.js 16** (App Router, Server Actions, React 19)
- **TypeScript** (strict mode)
- **Prisma** ORM with PostgreSQL
- **NextAuth v5** (Auth.js) — JWT strategy, credentials provider, Prisma adapter
- **shadcn/ui** + Radix UI for components
- **Tailwind CSS v4** for styling
- **React Hook Form** + **Zod** (v4) for form validation
- **Recharts** for charts
- **Vercel Blob** for framework data caching
- **Lucide React** for icons

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to DB
npm run db:seed      # Seed frameworks + demo data
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Prisma Studio GUI
npm run blob:upload  # Upload frameworks to Vercel Blob
```

## Project Structure

```
src/
├── app/
│   ├── (app)/                     # Authenticated routes (protected by middleware)
│   │   ├── onboarding/            # New user org setup
│   │   └── org/[orgSlug]/         # All org-scoped pages
│   │       ├── page.tsx           # Dashboard
│   │       ├── frameworks/        # Framework browser + detail pages
│   │       ├── assessments/       # Gap assessments
│   │       ├── soa/               # Statement of Applicability
│   │       ├── risks/             # Risk register
│   │       ├── tasks/             # Kanban task board
│   │       ├── documents/         # Document management
│   │       ├── audits/            # Audit management
│   │       ├── capa/              # Corrective & Preventive Actions
│   │       ├── evidence/          # Evidence collection
│   │       ├── training/          # Training programs + records
│   │       ├── controls/          # Control implementations
│   │       ├── reports/           # Compliance & risk reports
│   │       └── settings/          # Org settings + member management
│   ├── (auth)/                    # Login / register (public)
│   └── api/                       # NextAuth API routes
├── components/
│   ├── ui/                        # shadcn/ui primitives (DO NOT edit manually)
│   ├── layout/                    # App shell, sidebar, header, org-brand-styles
│   ├── frameworks/                # Clause tree, control list
│   ├── tasks/                     # Kanban board, task cards, edit dialog
│   ├── training/                  # Create/assign/delete training components
│   ├── settings/                  # Branding form, general settings form
│   └── shared/                    # Reusable components
└── lib/
    ├── auth.ts                    # NextAuth config (JWT, callbacks, session)
    ├── auth.config.ts             # Auth route matching config
    ├── db.ts                      # Prisma client singleton
    ├── blob.ts                    # Vercel Blob read/write helpers
    ├── actions/                   # Server actions (mutations) — 14 modules
    ├── queries/                   # Data fetching functions — 15 modules
    └── validations/               # Zod schemas for form validation
```

## Architecture & Patterns

### Multi-tenancy
- Shared database, all tenant-scoped tables have an `orgId` column
- Routes are scoped under `/org/[orgSlug]/`
- The org context is resolved from the URL slug, NOT from the session
- Session includes `orgId`, `orgSlug`, and `orgRole` for convenience

### Authentication & Authorization
- NextAuth v5 with JWT strategy (no database sessions)
- 30-day session lifetime with secure cookies in production
- Middleware (`middleware.ts`) protects all routes except `/`, `/login`, `/register`, and `/api`
- Logged-in users hitting auth pages are redirected to `/onboarding`
- RBAC enforced in server actions — use role-check patterns like `requireAdmin()`

### Data Layer
- **Server Actions** (`src/lib/actions/`) — All mutations. Accept FormData, validate with Zod, revalidate paths after writes.
- **Queries** (`src/lib/queries/`) — All read operations. Called directly from server components.
- **No REST API** for internal operations. Only API routes are for NextAuth handlers.
- **Soft deletes** — Many models use `deletedAt` instead of hard deletes. Always filter `deletedAt: null` in queries.

### Framework Data
- 10 frameworks seeded from `prisma/seed/` files (ISO 27001, ISO 9001, ISO 22301, SOC 2, GDPR, NIS2, HIPAA, PCI DSS, NIST CSF, DORA)
- Framework clause trees are optionally cached in Vercel Blob for faster page loads
- Blob helpers in `src/lib/blob.ts` — `getFrameworkFromBlob()`, `getAllFrameworksFromBlob()`
- Falls back to direct DB queries when Blob is unavailable

### UI Patterns
- All UI components use shadcn/ui primitives from `src/components/ui/`
- Do NOT manually edit files in `components/ui/` — regenerate with `npx shadcn add <component>`
- Forms use React Hook Form with Zod resolvers
- Toast notifications via `sonner` (`toast.success()`, `toast.error()`)
- Kanban board uses native HTML5 drag-and-drop API
- Theme support via `next-themes`

### Validation
- Zod v4 schemas in `src/lib/validations/`
- Server actions validate inputs before any DB operations
- Form components use `@hookform/resolvers` for client-side validation

## Database Schema

- **26 Prisma models** with **20+ enums** — see `prisma/schema.prisma`
- Key models: `Organization`, `Membership`, `Framework`, `Clause`, `Control`, `Assessment`, `Risk`, `Task`, `Audit`, `CAPA`, `Document`, `Evidence`, `TrainingProgram`, `TrainingRecord`, `SoAEntry`, `AuditLog`
- Relations are extensively defined — always check the schema for available relations before writing queries
- `orgId` is on: Organization, Membership, Assessment, Risk, ControlImplementation, Document, Audit, Evidence, Task, SoAEntry, CAPA, TrainingProgram, AuditLog, Notification, Tag, Comment

## Roles

Four roles with escalating permissions:
- **Viewer** — Read-only access
- **Auditor** — Read-only + can conduct audits
- **Manager** — Full CRUD on risks, tasks, documents, CAPAs, assessments, SoA
- **Admin** — Everything + member management, org settings, org creation

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Session signing secret |
| `AUTH_URL` | Yes | App base URL |
| `NEXTAUTH_URL` | Yes | Same as AUTH_URL (NextAuth compat) |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token for framework caching |

## Common Tasks

### Adding a new page
1. Create route file at `src/app/(app)/org/[orgSlug]/<module>/page.tsx`
2. Add query function in `src/lib/queries/<module>.ts`
3. Add server actions in `src/lib/actions/<module>.ts`
4. Add Zod schema in `src/lib/validations/<module>.ts` if needed
5. Add sidebar link in the layout component

### Adding a new framework
1. Create seed file at `prisma/seed/<framework>-clauses.ts`
2. Import and call from `prisma/seed/index.ts`
3. Run `npm run db:seed` to populate
4. Optionally run `npm run blob:upload` to cache in Blob

### Modifying the database schema
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` (development) or `npm run db:migrate` (production)
3. Run `npm run db:generate` to update the Prisma client
