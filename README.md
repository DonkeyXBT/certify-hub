<p align="center">
  <h1 align="center">Certifi by Cyfenced</h1>
  <p align="center">
    A modern, multi-tenant Governance, Risk &amp; Compliance platform for managing certification journeys across 10 frameworks.
    <br />
    <strong>ISO 27001 &middot; ISO 9001 &middot; SOC 2 Type II &middot; GDPR &middot; NIS2 &middot; HIPAA &middot; PCI DSS &middot; NIST CSF &middot; DORA &middot; ISO 22301</strong>
  </p>
</p>

<p align="center">
  <a href="https://gcrtool.cyfenced.nl">Live Platform</a> &middot;
  <a href="#getting-started">Getting Started</a> &middot;
  <a href="#features">Features</a> &middot;
  <a href="#supported-frameworks">Frameworks</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#architecture">Architecture</a>
</p>

---

## Overview

**Certifi by Cyfenced** is a production-ready GRC platform that helps organizations manage their compliance posture across multiple international standards. Built on the **Plan-Do-Check-Act (PDCA)** cycle, it provides a structured, auditable workflow from gap assessment through certification.

| Phase | What you do |
|-------|-------------|
| **Plan** | Browse frameworks, run gap assessments, register risks |
| **Do** | Implement controls, assign tasks, upload evidence |
| **Check** | Conduct internal audits, review the SoA, track compliance |
| **Act** | Raise CAPAs for findings, close out issues, iterate |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+ (or a hosted provider like [Neon](https://neon.tech))
- **npm** or equivalent package manager

### Quick Start

```bash
# Clone and install
git clone https://github.com/DonkeyXBT/certify-hub.git
cd certify-hub
npm install

# Configure environment
cp .env.example .env
# Edit .env — see Environment Variables below

# Set up database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Random secret for session signing (`openssl rand -base64 32`) | Yes |
| `AUTH_URL` | Full application URL (e.g. `https://yourdomain.com`) | Yes |
| `NEXTAUTH_URL` | Same as `AUTH_URL` (NextAuth compatibility) | Yes |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL used in emails | Yes |
| `RESEND_API_KEY` | [Resend](https://resend.com) API key for transactional emails | Yes |
| `EMAIL_FROM` | Sender address (e.g. `Certifi <noreply@yourdomain.com>`) | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for framework data caching | No |

### Demo Accounts

All demo users belong to the seeded "Acme Corp" organisation:

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `password123` | Admin — full access |
| `manager@example.com` | `password123` | Manager — risks, tasks, documents, CAPAs |
| `auditor@example.com` | `password123` | Auditor — read-only + audit management |
| `viewer@example.com` | `password123` | Viewer — read-only |

---

## Features

### Compliance Management
- **Framework browser** — Hierarchical clause trees with full control listings for 10 frameworks
- **Gap assessments** — Structured assessments with maturity scoring, compliance status, gaps, recommendations, and notes per control
- **Statement of Applicability (SoA)** — Central register of control applicability and implementation status
- **Compliance tracking** — Real-time compliance percentage per framework

### Risk Management
- **Risk register** — Full risk lifecycle from identification through treatment and closure
- **5×5 risk matrix** — Likelihood/impact scoring with inherent, residual, and target risk levels
- **Treatment plans** — Mitigate, accept, transfer, or avoid with documented rationale
- **Control mapping** — Link risks to control implementations for full traceability

### Task Management
- **Kanban board** — Drag-and-drop board with To Do, In Progress, In Review, Completed, and Overdue columns
- **Traceability** — Link tasks to assessments, control implementations, risks, or CAPAs
- **Priority and assignment** — Priority levels, assignees, and due dates
- **Slack notifications** — Optional per-org Slack webhook for task creation and status changes

### Audit Management
- **Audit planning** — Create audit programs with scope, objectives, type (internal/external/certification), and team assignment
- **Checklist management** — Structured audit checklists with clause references and compliance status per item
- **Findings management** — Record findings with severity levels (observation through major nonconformity) and track to closure
- **CAPA integration** — Raise corrective/preventive actions directly from audit findings

### Document & Evidence Management
- **Document library** — Categorize policies, procedures, records, and forms with version tracking
- **Evidence collection** — Attach evidence artifacts (documents, screenshots, logs, certificates, external links) to control implementations
- **Approval workflows** — Submit, review, and approve documents with full audit trail

### Training Management
- **Training programs** — Create programs with frequency, validity period, passing score, and mandatory flags
- **User assignment** — Assign training to specific members; new users receive onboarding emails
- **Self-service** — Members can start and complete their own training directly (with optional score entry)
- **Completion tracking** — Overview table with per-program completion rates across the organisation

### Integrations
- **Slack** — Per-organization Slack Incoming Webhook integration with configurable notifications:
  - Task created / status changed
  - Assessment control saved
  - Assessment completed (with score)
  - Rich Block Kit messages with color-coded attachments and action buttons

### Organisation & Access Control
- **Multi-tenancy** — Full org isolation with slug-based routing (`/org/[slug]/...`)
- **Role-based access** — Admin, Manager, Auditor, and Viewer roles with granular permission enforcement
- **Super admin panel** — Platform-level admin interface for managing all organisations and users
- **Member management** — Invite members by email; accounts are auto-created with a verification email
- **Audit logging** — All significant actions tracked with old/new values for compliance traceability
- **Dashboard** — Overview widgets for compliance status, open tasks, risks, and upcoming deadlines

### Authentication
- **Email + password** — Credentials-based login with bcrypt password hashing
- **Email verification** — New accounts require email verification before login
- **Forgot password** — Self-service password reset via email link (1-hour expiry)
- **Secure sessions** — JWT strategy with 30-day sessions and `__Secure-` cookie prefix in production

---

## Supported Frameworks

| Framework | Standard | Focus Area |
|-----------|----------|------------|
| **ISO 27001:2022** | Information security management | 93 Annex A controls |
| **ISO 9001:2015** | Quality management | Clause-based requirements |
| **ISO 22301:2019** | Business continuity management | Full clause structure |
| **SOC 2 Type II** | Trust services criteria | Security, Availability, Confidentiality, Processing Integrity, Privacy |
| **GDPR** | EU data protection regulation | Articles and recitals |
| **NIS2** | EU network and information security | Directive requirements |
| **HIPAA** | US health information privacy | Administrative, physical, and technical safeguards |
| **PCI DSS v4.0** | Payment card security | 12 requirement areas |
| **NIST CSF 2.0** | Cybersecurity framework | Govern, Identify, Protect, Detect, Respond, Recover |
| **DORA** | EU digital operational resilience | ICT risk management requirements |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React 19) |
| **Language** | TypeScript (strict) |
| **Database** | PostgreSQL 14+ via [Neon](https://neon.tech) |
| **ORM** | [Prisma](https://www.prisma.io/) (26+ models, 20+ enums) |
| **Auth** | [NextAuth v5](https://authjs.dev/) (JWT strategy, Prisma adapter, credentials provider) |
| **Email** | [Resend](https://resend.com) (account verification, password reset, member invites) |
| **UI** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Forms** | React Hook Form + Zod |
| **Charts** | [Recharts](https://recharts.org/) |
| **Storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (framework clause caching) |
| **Notifications** | [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks) (Block Kit) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## Architecture

```
certify-hub/
├── prisma/
│   ├── schema.prisma              # 26+ models, 20+ enums
│   └── seed/                      # Framework data + demo accounts
│       ├── index.ts               # Seed orchestrator
│       ├── demo-data.ts           # Demo users and org
│       ├── iso27001-clauses.ts
│       ├── iso9001-clauses.ts
│       ├── iso22301-clauses.ts
│       ├── soc2-clauses.ts
│       ├── gdpr-clauses.ts
│       ├── nis2-clauses.ts
│       ├── hipaa-clauses.ts
│       ├── pcidss-clauses.ts
│       ├── nist-csf-clauses.ts
│       └── dora-clauses.ts
├── src/
│   ├── app/
│   │   ├── (app)/                 # Authenticated app routes
│   │   │   ├── onboarding/        # New user onboarding flow
│   │   │   └── org/[orgSlug]/     # Multi-tenant org routes
│   │   │       ├── page.tsx       # Dashboard
│   │   │       ├── frameworks/    # Framework browser
│   │   │       ├── assessments/   # Gap assessments
│   │   │       ├── soa/           # Statement of Applicability
│   │   │       ├── risks/         # Risk register
│   │   │       ├── tasks/         # Kanban board
│   │   │       ├── documents/     # Document management
│   │   │       ├── audits/        # Audit management
│   │   │       ├── capa/          # Corrective & Preventive Actions
│   │   │       ├── evidence/      # Evidence collection
│   │   │       ├── training/      # Training programs
│   │   │       ├── controls/      # Control implementations
│   │   │       ├── reports/       # Compliance & risk reports
│   │   │       └── settings/      # Org settings, members, Slack
│   │   ├── (auth)/                # Public auth routes
│   │   │   ├── login/             # Sign in
│   │   │   ├── register/          # Register
│   │   │   ├── verify/[token]/    # Email verification & account setup
│   │   │   ├── forgot-password/   # Password reset request
│   │   │   └── reset-password/    # Password reset via token
│   │   ├── admin/                 # Super admin panel
│   │   └── api/                   # API routes (auth handlers)
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── layout/                # App shell, sidebar, org switcher
│   │   ├── admin/                 # Admin panel components
│   │   ├── auth/                  # Login, verify, forgot/reset password forms
│   │   ├── frameworks/            # Clause tree, control list
│   │   ├── tasks/                 # Kanban board, task cards
│   │   ├── training/              # Training dialogs, self-service actions
│   │   ├── settings/              # Settings tabs including Slack integration
│   │   └── ...                    # Module-specific components
│   └── lib/
│       ├── auth.ts                # NextAuth v5 configuration
│       ├── auth.config.ts         # Edge-compatible auth config
│       ├── db.ts                  # Prisma client singleton
│       ├── email.ts               # Resend email templates
│       ├── slack.ts               # Slack Block Kit notifications
│       ├── actions/               # Server actions per module
│       │   ├── admin.ts           # Super admin CRUD
│       │   ├── auth.ts            # Login, register, password reset
│       │   ├── assessments.ts
│       │   ├── organization.ts
│       │   ├── tasks.ts
│       │   ├── training.ts
│       │   └── ...
│       ├── queries/               # Read-only data fetching
│       └── validations/           # Zod schemas
├── middleware.ts                   # Auth route protection
└── scripts/
    └── upload-frameworks-to-blob.ts
```

### Key Design Decisions

- **Multi-tenancy** — Shared database with `orgId` on all tenant-scoped tables. Slug-based routing (`/org/[orgSlug]/...`). Organization isolation enforced in every server action.
- **Server Actions** — All mutations use Next.js Server Actions with `revalidatePath`. No internal REST API.
- **Auth** — NextAuth v5 with JWT strategy, 30-day sessions, `isSuperAdmin` flag in token, and `__Secure-` cookie prefix in production.
- **RBAC** — Role hierarchy (Admin > Manager > Auditor > Viewer) enforced server-side via `requireAdmin()` guards. Super admins bypass org-level restrictions via a dedicated admin panel.
- **Soft deletes** — Orgs, risks, documents, and tasks use `deletedAt` timestamps to preserve audit trails.
- **Framework caching** — Clause trees stored in Vercel Blob for fast reads; falls back to direct DB queries if Blob is unavailable.
- **Email flow** — New members and self-registered users receive a verification link. Existing verified users can reset their password via a time-limited token (1 hour).

---

## Roles & Permissions

| Permission | Admin | Manager | Auditor | Viewer |
|------------|-------|---------|---------|--------|
| View dashboard, reports, frameworks | ✓ | ✓ | ✓ | ✓ |
| Run assessments, update SoA | ✓ | ✓ | — | — |
| Manage risks, tasks, documents | ✓ | ✓ | — | — |
| Manage CAPAs | ✓ | ✓ | — | — |
| Conduct audits & record findings | ✓ | — | ✓ | — |
| Manage members & org settings | ✓ | — | — | — |
| Configure Slack integration | ✓ | — | — | — |
| Complete own assigned training | ✓ | ✓ | ✓ | ✓ |

Super admins additionally have access to the `/admin` panel where they can create/edit/delete organisations, manage platform users, assign roles, and grant super admin access to others.

---

## Scripts

```bash
npm run dev           # Start development server (http://localhost:3000)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:push       # Push schema changes directly to the database
npm run db:migrate    # Create and run Prisma migrations
npm run db:seed       # Seed frameworks + demo data
npm run db:studio     # Open Prisma Studio GUI
npm run blob:upload   # Upload framework clause data to Vercel Blob
```

---

## Deployment

The platform is designed to deploy on **Vercel** with a **Neon** PostgreSQL database.

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/new)
2. Add all required environment variables in the Vercel dashboard
3. Run `npm run db:push && npm run db:seed` against your production database once to initialise the schema and seed framework data

The `blob:upload` script can be run once to cache all framework clause trees in Vercel Blob for faster load times.

---

## License

MIT — built by [Cyfenced](https://cyfenced.nl).
