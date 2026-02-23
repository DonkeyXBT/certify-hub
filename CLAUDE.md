# CLAUDE.md — CertifyHub AI Assistant Guide

This file provides guidance for AI assistants (Claude Code and similar tools) working on the CertifyHub codebase.

---

## Project Overview

**CertifyHub** is a multi-tenant Governance, Risk & Compliance (GRC) platform that guides organizations through ISO certification journeys following the Plan-Do-Check-Act (PDCA) cycle. It supports frameworks including ISO 27001:2022, ISO 9001:2015, GDPR, SOC 2, HIPAA, PCI DSS, NIS2, NIST CSF, DORA, and ISO 22301.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL 14+ via Prisma 6 ORM |
| Auth | NextAuth v5 (Auth.js) — credentials provider |
| UI | shadcn/ui + Radix UI + Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Tables | TanStack React Table v8 |
| Charts | Recharts |
| File Storage | Vercel Blob |
| Notifications | Sonner (toast) |
| Icons | Lucide React |

---

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Database operations
npm run db:generate    # Regenerate Prisma client after schema changes
npm run db:push        # Push schema changes to database (dev only)
npm run db:migrate     # Create and apply a named migration
npm run db:seed        # Seed frameworks + demo accounts
npm run db:studio      # Open Prisma Studio GUI

# Upload framework data to Vercel Blob
npm run blob:upload
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/certifyhub"
AUTH_SECRET="<generate with: openssl rand -base64 32>"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="<vercel blob token, optional>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Repository Structure

```
certify-hub/
├── prisma/
│   ├── schema.prisma              # 26 models, 20+ enums
│   └── seed/                      # Framework data + demo accounts
│       ├── index.ts
│       ├── demo-data.ts
│       ├── iso27001-clauses.ts
│       ├── iso9001-clauses.ts
│       └── ... (one file per framework)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (app)/
│   │   │   ├── org/[orgSlug]/     # All authenticated, org-scoped routes
│   │   │   │   ├── page.tsx       # Dashboard
│   │   │   │   ├── frameworks/
│   │   │   │   ├── assessments/
│   │   │   │   ├── soa/           # Statement of Applicability
│   │   │   │   ├── risks/
│   │   │   │   ├── tasks/         # Kanban board
│   │   │   │   ├── documents/
│   │   │   │   ├── audits/
│   │   │   │   ├── capa/          # Corrective & Preventive Actions
│   │   │   │   ├── evidence/
│   │   │   │   ├── training/
│   │   │   │   ├── reports/
│   │   │   │   ├── controls/
│   │   │   │   └── settings/      # Admin-only
│   │   │   └── onboarding/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── page.tsx               # Public landing page
│   │   └── api/
│   │       └── auth/[...nextauth]/ # NextAuth handler
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── layout/                # Sidebar, header, org-switcher
│   │   ├── dashboard/
│   │   ├── assessments/
│   │   ├── tasks/
│   │   ├── frameworks/
│   │   ├── risks/
│   │   ├── training/
│   │   ├── auth/
│   │   ├── settings/
│   │   ├── shared/                # Reusable components
│   │   └── providers/             # React context providers
│   ├── lib/
│   │   ├── auth.ts                # NextAuth v5 config
│   │   ├── auth.config.ts         # Edge-compatible auth config
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── actions/               # Server Actions (all mutations)
│   │   ├── queries/               # Server-side data fetching
│   │   ├── validations/           # Zod schemas
│   │   └── utils/                 # Utility functions
│   ├── config/
│   │   ├── nav.ts                 # Navigation config
│   │   └── site.ts                # Site metadata
│   ├── types/
│   │   ├── index.ts
│   │   └── next-auth.d.ts         # Session type augmentation
│   └── hooks/                     # Custom React hooks
├── middleware.ts                   # Auth route protection
├── next.config.ts
├── tsconfig.json
├── components.json                 # shadcn/ui config
└── .env.example
```

---

## Architecture Patterns

### Multi-Tenancy

CertifyHub uses a **shared database** approach. Every tenant-scoped table has an `orgId` column. All data access **must** be filtered by `orgId`.

```typescript
// Always filter by orgId in queries
return db.risk.findMany({
  where: { orgId, deletedAt: null },
})
```

The current organization is stored in the session (`session.user.orgId`). Users can belong to multiple organizations and switch via the org-switcher component.

### Server Actions (No REST API)

All mutations use **Next.js Server Actions** — there is no REST API (except the NextAuth auth endpoint). When adding new features, put mutations in `src/lib/actions/` and data fetching in `src/lib/queries/`.

**Server Action pattern:**

```typescript
"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({ /* ... */ })

export async function createSomething(data: unknown) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const parsed = schema.parse(data)

  const result = await db.something.create({
    data: { ...parsed, orgId: session.user.orgId! }
  })

  revalidatePath(`/org/${session.user.orgSlug}/something`)
  return result
}
```

### Data Fetching Pattern

Query functions in `src/lib/queries/` are async server functions called directly from page components (RSC):

```typescript
// src/lib/queries/risks.ts
export async function getRisksByOrgId(orgId: string) {
  return db.risk.findMany({
    where: { orgId, deletedAt: null },
    include: { category: true, treatments: true },
    orderBy: { createdAt: "desc" },
  })
}
```

### Validation

All forms use **Zod schemas** defined in `src/lib/validations/`. Validate on the client (React Hook Form + Zod resolver) and re-validate on the server in the action.

### Role-Based Access Control (RBAC)

Four roles: `ADMIN`, `MANAGER`, `AUDITOR`, `VIEWER`. The role is embedded in the session (`session.user.orgRole`).

Admin-only actions must call a guard at the top of the action:

```typescript
// Pattern used throughout actions
const session = await auth()
if (session?.user?.orgRole !== "ADMIN") throw new Error("Forbidden")
```

| Capability | ADMIN | MANAGER | AUDITOR | VIEWER |
|-----------|:-----:|:-------:|:-------:|:------:|
| View all data | ✓ | ✓ | ✓ | ✓ |
| Run assessments | ✓ | ✓ | | |
| Manage risks/tasks/documents | ✓ | ✓ | | |
| Conduct audits | ✓ | | ✓ | |
| Manage CAPA | ✓ | ✓ | | |
| Manage members | ✓ | | | |
| Organization settings | ✓ | | | |

### Route Protection

`middleware.ts` uses NextAuth to protect all routes under `/(app)`. Unauthenticated users are redirected to `/login`. Authenticated users accessing auth pages are redirected to `/onboarding`.

---

## Database Schema

### Key Models

| Model | Purpose |
|-------|---------|
| `User` | User accounts (email + bcrypt password) |
| `Organization` | Multi-tenant root entity |
| `Membership` | User ↔ Org mapping with `OrgRole` |
| `Framework` | Compliance standards (ISO 27001, etc.) |
| `Clause` | Hierarchical clauses within a framework |
| `Control` | Individual controls within clauses |
| `SoAEntry` | Statement of Applicability per org |
| `ControlImplementation` | Org-specific control status |
| `Assessment` | Gap assessment against a framework |
| `AssessmentResponse` | Individual responses within an assessment |
| `Risk` | Risk register entries |
| `RiskControlMapping` | Risk ↔ Control linkage |
| `Document` | Policy/procedure documents |
| `DocumentVersion` | Version history with approval state |
| `Evidence` | Supporting artifacts |
| `Audit` | Internal/external audits |
| `AuditFinding` | Non-conformities and observations |
| `Task` | Work items (Kanban board) |
| `CAPA` | Corrective & Preventive Actions |
| `TrainingProgram` | Training requirements |
| `TrainingRecord` | Completion records |
| `Notification` | In-app notifications |
| `AuditLog` | Compliance audit trail |

### Important Enums

```prisma
enum OrgRole          { ADMIN MANAGER AUDITOR VIEWER }
enum ComplianceStatus { NOT_ASSESSED NON_COMPLIANT PARTIALLY_COMPLIANT COMPLIANT }
enum RiskLevel        { LOW MEDIUM HIGH CRITICAL }
enum RiskTreatment    { ACCEPT MITIGATE TRANSFER AVOID }
enum ControlImplStatus { NOT_IMPLEMENTED PLANNED PARTIALLY_IMPLEMENTED FULLY_IMPLEMENTED NOT_APPLICABLE }
enum TaskStatus       { TODO IN_PROGRESS IN_REVIEW COMPLETED CANCELLED OVERDUE }
enum AuditStatus      { PLANNED IN_PROGRESS FIELDWORK_COMPLETE REPORT_DRAFT REPORT_FINAL CLOSED }
enum CAPAStatus       { OPEN ROOT_CAUSE_ANALYSIS ACTION_PLANNED ACTION_IN_PROGRESS VERIFICATION CLOSED CLOSED_INEFFECTIVE }
enum DocumentStatus   { DRAFT PENDING_REVIEW PENDING_APPROVAL APPROVED SUPERSEDED OBSOLETE }
enum FindingSeverity  { OBSERVATION OPPORTUNITY_FOR_IMPROVEMENT MINOR_NONCONFORMITY MAJOR_NONCONFORMITY }
```

### Schema Changes

After modifying `prisma/schema.prisma`:

1. **Development**: `npm run db:push` (applies changes directly, no migration file)
2. **Production**: `npm run db:migrate` (creates a versioned migration)
3. **Always**: `npm run db:generate` (regenerates the Prisma client)

---

## Authentication

- **Provider**: Credentials (email + bcrypt password, 12 salt rounds)
- **Session**: JWT strategy, 30-day duration
- **Session contains**: `id`, `name`, `email`, `orgId`, `orgSlug`, `orgRole`
- **Type augmentation**: `src/types/next-auth.d.ts`

Access the session in Server Components and actions:

```typescript
import { auth } from "@/lib/auth"

const session = await auth()
const { id, orgId, orgSlug, orgRole } = session?.user ?? {}
```

---

## UI Components

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/`. Do not edit them manually — use the CLI to update.

### Conventions

- Use `cn()` from `@/lib/utils` to merge class names.
- All toast notifications use `sonner` (`toast.success()`, `toast.error()`).
- Forms follow the `react-hook-form` + `zodResolver` pattern used throughout the codebase.
- Status badges use consistent color conventions: green = compliant/complete, yellow = partial/in-progress, red = non-compliant/critical, gray = not assessed.

---

## Path Aliases

The `@/*` alias maps to `src/*`:

```typescript
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { getRisksByOrgId } from "@/lib/queries/risks"
```

---

## Key Conventions

### File Organization

- **Server Actions** → `src/lib/actions/<domain>.ts`
- **Data queries** → `src/lib/queries/<domain>.ts`
- **Zod schemas** → `src/lib/validations/<domain>.ts`
- **Page components** → `src/app/(app)/org/[orgSlug]/<feature>/page.tsx`
- **Feature components** → `src/components/<feature>/`
- **Shared components** → `src/components/shared/`
- **Reusable UI** → `src/components/ui/` (shadcn only)

### Naming

- Files and folders: `kebab-case`
- Components: `PascalCase`
- Functions and variables: `camelCase`
- Database models: `PascalCase` (Prisma convention)
- Zod schemas: `camelCase` with `Schema` suffix (e.g., `createRiskSchema`)

### Soft Deletes

Many models support soft deletion via a `deletedAt` timestamp. Always filter these out in queries:

```typescript
where: { orgId, deletedAt: null }
```

### Audit Logging

Use the audit logger utility when making significant changes to compliance-sensitive data:

```typescript
import { logAuditEvent } from "@/lib/utils/audit-logger"

await logAuditEvent({
  userId: session.user.id,
  orgId: session.user.orgId!,
  action: "UPDATED",
  entityType: "Risk",
  entityId: risk.id,
  oldValues: { /* ... */ },
  newValues: { /* ... */ },
})
```

### Cache Invalidation

After mutations, call `revalidatePath()` with the relevant route to refresh server-rendered data:

```typescript
import { revalidatePath } from "next/cache"

revalidatePath(`/org/${orgSlug}/risks`)
```

---

## Demo Accounts

The seed script creates these accounts in the `acme-corp` organization:

| Email | Password | Role |
|-------|---------|------|
| admin@certifyhub.demo | password123 | ADMIN |
| auditor@certifyhub.demo | password123 | AUDITOR |
| manager@certifyhub.demo | password123 | MANAGER |
| viewer@certifyhub.demo | password123 | VIEWER |

Run `npm run db:seed` to populate them.

---

## Testing

There is currently no test framework configured. When adding tests:

- Use **Vitest** or **Jest** for unit/integration tests
- Use **Playwright** for E2E tests
- Place unit tests adjacent to the file they test: `foo.ts` → `foo.test.ts`
- Place E2E tests in `e2e/`

---

## Linting

ESLint is configured via `eslint.config.mjs` using Next.js and TypeScript rules. Run before committing:

```bash
npm run lint
```

---

## Common Gotchas

1. **Prisma client not updated**: After any `schema.prisma` change, run `npm run db:generate` or the Prisma client will be out of sync.

2. **orgId always required**: Every query/mutation touching tenant data must include `orgId`. Never fetch data without org scoping.

3. **Server Actions vs API Routes**: This project has no REST API for mutations. Don't create `route.ts` files for CRUD — use Server Actions in `src/lib/actions/`.

4. **Auth in Server Actions**: Always call `await auth()` and check for a valid session at the top of every action. Never trust client-passed user IDs.

5. **Role checks for destructive or admin operations**: Check `session.user.orgRole` before admin/manager-only operations.

6. **`revalidatePath` after mutations**: Forgetting this means the UI won't reflect changes until the user manually refreshes.

7. **Soft deletes**: Some models use `deletedAt` for soft deletion. Always add `deletedAt: null` to WHERE clauses.

8. **NextAuth v5 beta**: Auth.js v5 is in beta. The API differs from v4 — use `auth()` (not `getServerSession()`), and import from `next-auth` not `next-auth/react` for server contexts.
