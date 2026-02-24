<p align="center">
  <h1 align="center">CertifyHub</h1>
  <p align="center">
    Open-source Governance, Risk & Compliance platform for managing multi-framework certification journeys.
    <br />
    <strong>ISO 27001 &middot; ISO 9001 &middot; SOC 2 &middot; GDPR &middot; HIPAA &middot; NIST CSF &middot; PCI DSS &middot; NIS2 &middot; DORA &middot; ISO 22301</strong>
  </p>
</p>

<p align="center">
  <a href="#getting-started">Getting Started</a> &middot;
  <a href="#features">Features</a> &middot;
  <a href="#supported-frameworks">Frameworks</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#roadmap">Roadmap</a>
</p>

---

## Why CertifyHub?

Most GRC tools are expensive, bloated, and locked behind enterprise sales calls. CertifyHub is different — it's open-source, self-hostable, and built for teams that want a clean, modern compliance workflow without the overhead.

CertifyHub follows the **Plan-Do-Check-Act (PDCA)** cycle at its core:

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
- **PostgreSQL** 14+
- **npm**, **yarn**, or **pnpm**

### Quick Start

```bash
# Clone and install
git clone https://github.com/DonkeyXBT/certify-hub.git
cd certify-hub
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and auth secret

# Set up database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with a demo account.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Random secret for session signing (`openssl rand -base64 32`) | Yes |
| `AUTH_URL` | Application URL (e.g. `http://localhost:3000`) | Yes |
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
- **Gap assessments** — Structured assessments with maturity scoring and gap analysis
- **Statement of Applicability** — Central register of control applicability and implementation status
- **Compliance tracking** — Real-time compliance percentage per framework

### Risk Management
- **Risk register** — Full risk lifecycle from identification through treatment
- **5x5 risk matrix** — Likelihood/impact scoring with inherent, residual, and target risk levels
- **Treatment plans** — Mitigate, accept, transfer, or avoid with documented rationale
- **Control mapping** — Link risks to control implementations for traceability

### Task Management
- **Kanban board** — Drag-and-drop board with To Do, In Progress, In Review, and Done columns
- **Traceability** — Link tasks to controls, risks, or CAPAs
- **Priority and assignment** — Priority levels, assignees, and due dates

### Audit Management
- **Audit planning** — Create audit programs with scope, objectives, and team assignment
- **Findings management** — Record findings with severity levels and track through to closure
- **CAPA integration** — Raise corrective/preventive actions directly from audit findings

### Document & Evidence Management
- **Document library** — Upload and categorize policies, procedures, records, and forms
- **Evidence collection** — Attach evidence artifacts to control implementations
- **Approval workflows** — Document review and approval tracking

### Training Management
- **Training programs** — Create and manage training programs with descriptions and requirements
- **User assignment** — Assign training to specific users with status tracking
- **Completion tracking** — Track progress across the organisation

### Organisation & Access
- **Multi-tenancy** — Full org isolation with slug-based routing
- **Role-based access** — Admin, Manager, Auditor, and Viewer roles with granular permissions
- **Audit logging** — All significant actions tracked for compliance traceability
- **Dashboard** — Overview widgets for compliance status, tasks, risks, and upcoming deadlines

---

## Supported Frameworks

The seed script includes full clause hierarchies and controls for all 10 frameworks:

| Framework | Standard | Controls |
|-----------|----------|----------|
| **ISO 27001:2022** | Information security management | 93 Annex A controls |
| **ISO 9001:2015** | Quality management | Clause-based requirements |
| **ISO 22301:2019** | Business continuity management | Full clause structure |
| **SOC 2 Type II** | Trust services criteria | Security, Availability, Processing Integrity, Confidentiality, Privacy |
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
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) |
| **Language** | TypeScript (strict) |
| **Database** | PostgreSQL 14+ |
| **ORM** | [Prisma](https://www.prisma.io/) (26 models, 20+ enums) |
| **Auth** | [NextAuth v5](https://authjs.dev/) (JWT strategy, Prisma adapter, credentials provider) |
| **UI** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | [Recharts](https://recharts.org/) |
| **Storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (framework data caching) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Architecture

```
certify-hub/
├── prisma/
│   ├── schema.prisma              # 26 models, 20+ enums
│   └── seed/                      # Framework data + demo accounts
│       ├── index.ts               # Seed orchestrator + Blob upload
│       ├── demo-data.ts           # Demo users and org
│       ├── iso27001-clauses.ts    # ISO 27001:2022
│       ├── iso9001-clauses.ts     # ISO 9001:2015
│       ├── iso22301-clauses.ts    # ISO 22301:2019
│       ├── soc2-clauses.ts        # SOC 2 Type II
│       ├── gdpr-clauses.ts        # GDPR
│       ├── nis2-clauses.ts        # NIS2 Directive
│       ├── hipaa-clauses.ts       # HIPAA
│       ├── pcidss-clauses.ts      # PCI DSS v4.0
│       ├── nist-csf-clauses.ts    # NIST CSF 2.0
│       └── dora-clauses.ts        # DORA
├── src/
│   ├── app/
│   │   ├── (app)/                 # Authenticated routes
│   │   │   ├── onboarding/        # New user onboarding
│   │   │   └── org/[orgSlug]/     # Multi-tenant org routes
│   │   │       ├── page.tsx       # Dashboard
│   │   │       ├── frameworks/    # Framework browser
│   │   │       ├── assessments/   # Gap assessments
│   │   │       ├── soa/           # Statement of Applicability
│   │   │       ├── risks/         # Risk register
│   │   │       ├── tasks/         # Kanban board
│   │   │       ├── documents/     # Document management
│   │   │       ├── audits/        # Audit management
│   │   │       ├── capa/          # CAPAs
│   │   │       ├── evidence/      # Evidence collection
│   │   │       ├── training/      # Training programs
│   │   │       ├── controls/      # Control implementations
│   │   │       ├── reports/       # Compliance & risk reports
│   │   │       └── settings/      # Org settings & members
│   │   ├── (auth)/                # Login / register
│   │   └── api/                   # API routes (auth handlers)
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── layout/                # App shell, sidebar, header
│   │   ├── frameworks/            # Clause tree, control list
│   │   ├── tasks/                 # Kanban board, task cards
│   │   ├── training/              # Training dialogs & actions
│   │   └── ...                    # Module-specific components
│   └── lib/
│       ├── auth.ts                # NextAuth v5 configuration
│       ├── auth.config.ts         # Auth route config
│       ├── db.ts                  # Prisma client singleton
│       ├── blob.ts                # Vercel Blob helpers
│       ├── actions/               # Server actions (14 modules)
│       ├── queries/               # Data fetching (15 modules)
│       └── validations/           # Zod schemas
└── middleware.ts                   # Auth route protection
```

### Key Design Decisions

- **Multi-tenancy** — Shared database with `orgId` on all tenant-scoped tables. Slug-based routing (`/org/[orgSlug]/...`).
- **Server Actions** — All mutations use Next.js Server Actions. No REST API for internal operations.
- **Auth** — NextAuth v5 with JWT strategy, 30-day sessions, secure cookies in production.
- **RBAC** — Role-based access enforced in server actions with `requireAdmin()` / role-check helpers.
- **Soft deletes** — Records use `deletedAt` timestamps for audit trail preservation.
- **Framework caching** — Framework clause trees cached in Vercel Blob for faster page loads. Falls back to direct DB queries.

---

## Roles & Permissions

| Permission | Admin | Manager | Auditor | Viewer |
|-----------|-------|---------|---------|--------|
| View dashboard, reports, frameworks | Yes | Yes | Yes | Yes |
| Run assessments, update SoA | Yes | Yes | No | No |
| Manage risks, tasks, documents | Yes | Yes | No | No |
| Manage CAPAs | Yes | Yes | No | No |
| Conduct audits | Yes | No | Yes | No |
| Manage members & settings | Yes | No | No | No |
| Create organisations | Yes | No | No | No |

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Regenerate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed frameworks + demo data
npm run db:studio    # Open Prisma Studio
npm run blob:upload  # Upload frameworks to Vercel Blob
```

---

## Roadmap

- [ ] Email notifications for task assignments, due dates, and audit schedules
- [ ] Bulk control implementation updates from the SoA view
- [ ] Document versioning with approval workflows
- [ ] Risk heat map visualization (interactive 5x5 matrix)
- [ ] PDF report generation for management reviews and audit evidence
- [ ] Cross-framework control mapping
- [ ] API access with key authentication
- [ ] SSO / SAML integration
- [ ] AI-powered gap analysis and risk suggestions
- [ ] Mobile-optimized audit fieldwork

---

## License

MIT

---

Built with CertifyHub. Start your compliance journey today.
