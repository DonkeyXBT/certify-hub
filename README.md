<div align="center">

# CertifyHub

**The open-source GRC platform for modern ISO certification journeys**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

CertifyHub guides organisations through the complete **Plan-Do-Check-Act (PDCA)** cycle for ISO standards — from initial gap assessment through control implementation, evidence collection, internal audits, and continuous improvement.

[Getting Started](#getting-started) · [Features](#feature-guide) · [Architecture](#architecture) · [Roadmap](#planned-features) · [Frameworks](#upcoming-frameworks)

</div>

---

## Table of Contents

- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [How It Works](#how-it-works)
- [Step-by-Step: Your First ISO Framework](#step-by-step-your-first-iso-framework)
- [Feature Guide](#feature-guide)
- [Roles & Permissions](#roles--permissions)
- [Architecture](#architecture)
- [Planned Features](#planned-features)
- [Upcoming Frameworks](#upcoming-frameworks)
- [Tech Stack](#tech-stack)

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| PostgreSQL | 14+ |
| Package manager | npm / yarn / pnpm |

### Installation

```bash
git clone https://github.com/DonkeyXBT/certify-hub.git
cd certify-hub
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/certifyhub"
AUTH_SECRET="your-random-secret-here"   # openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
npx prisma db push      # Create database tables
npx prisma db seed      # Seed ISO frameworks + demo accounts
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

---

## Demo Accounts

The seed script creates four demo users under the **"Acme Corp"** organisation:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@example.com` | `password123` | Full access — members, settings, all modules |
| **Auditor** | `auditor@example.com` | `password123` | Read-only across all modules, manage audits |
| **Manager** | `manager@example.com` | `password123` | Manage risks, tasks, documents, CAPAs |
| **Viewer** | `viewer@example.com` | `password123` | Read-only access to all modules |

---

## How It Works

CertifyHub follows the **Plan-Do-Check-Act (PDCA)** cycle — the backbone of every ISO management system:

```
┌─────────────────────────────────────────────────────────────┐
│                    PDCA Compliance Cycle                    │
├──────────────┬──────────────┬──────────────┬───────────────┤
│     PLAN     │      DO      │    CHECK     │      ACT      │
│──────────────│──────────────│──────────────│───────────────│
│ Gap assess   │ Implement    │ Internal     │ CAPAs &       │
│ Risk register│ controls     │ audits       │ corrective    │
│ SoA review   │ Upload       │ Review SoA   │ actions       │
│              │ evidence     │ Track scores │ Iterate       │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

1. **PLAN** — Browse your chosen ISO framework, run a gap assessment, identify risks, and plan your approach.
2. **DO** — Implement controls mapped to framework clauses, assign tasks to your team, and upload evidence.
3. **CHECK** — Conduct internal audits, review the Statement of Applicability, and track compliance progress.
4. **ACT** — Raise CAPAs for non-conformities, close findings, and continuously improve your management system.

---

## Step-by-Step: Your First ISO Framework

### Step 1 — Sign Up and Create Your Organisation

1. Navigate to the login page and sign in (or use a demo account).
2. On first login, complete the onboarding — enter your organisation name and slug.
3. You'll land on your organisation dashboard.

### Step 2 — Add Team Members

1. Go to **Settings > Members** in the sidebar.
2. Use the "Add Member" form to invite colleagues by email.
3. Assign each person a role: Admin, Manager, Auditor, or Viewer.

### Step 3 — Browse Available Frameworks

1. Click **Frameworks** in the sidebar.
2. View published frameworks — ISO 27001:2022 and ISO 9001:2015 are pre-seeded.
3. Each card shows the clause count, control count, and your current compliance percentage.

### Step 4 — Explore a Framework

1. Click a framework card to see its detail page.
2. The **Clauses** tab shows the hierarchical clause structure (e.g. Clause 4 > 4.1 > 4.1.1).
3. The **Controls** tab lists all controls with descriptions and implementation guidance.
4. A progress bar at the top shows your overall compliance status.

### Step 5 — Run a Gap Assessment

1. Go to **Assessments** in the sidebar.
2. Click **New Assessment** and select the framework.
3. Walk through the wizard — rate your maturity level for each control and add notes.
4. Submit to see your gap analysis results and charts.

### Step 6 — Review the Statement of Applicability (SoA)

1. Navigate to **Statement of Applicability** in the sidebar.
2. The SoA lists every control with its applicability and implementation status.
3. Mark controls as applicable or not applicable with justification.
4. Track implementation status: Not Implemented, Partially Implemented, or Fully Implemented.

### Step 7 — Identify and Register Risks

1. Go to **Risks** in the sidebar.
2. Click **Add Risk** to register a new risk.
3. Fill in: title, description, category, likelihood (1–5), impact (1–5).
4. The risk score is auto-calculated (likelihood × impact).
5. Set a treatment plan: Mitigate, Accept, Transfer, or Avoid.
6. Link the risk to relevant SoA controls.

### Step 8 — Create and Assign Tasks

1. Go to **Tasks** in the sidebar.
2. The Kanban board shows four columns: To Do, In Progress, In Review, and Done.
3. Click **Add Task** and fill in: title, description, priority, assignee, due date.
4. Optionally link the task to a control, risk, or CAPA for full traceability.
5. Drag cards between columns to update status.

### Step 9 — Implement Controls

1. From the SoA or framework detail page, select a control to implement.
2. Update its implementation status as you make progress.
3. Link tasks to controls so your team knows exactly what work is required.
4. Watch your compliance percentage climb on the framework page.

### Step 10 — Upload Evidence Documents

1. Go to **Documents** in the sidebar.
2. Upload policies, procedures, records, and other evidence.
3. Categorise documents: Policy, Procedure, Record, Form, Guide, etc.
4. Link documents to specific controls as proof of implementation.

### Step 11 — Conduct Internal Audits

1. Navigate to **Audits** in the sidebar.
2. Create a new audit and select the scope (which clauses/controls to audit).
3. Assign auditors and set the audit schedule.
4. Record findings: Conformity, Minor Non-conformity, Major Non-conformity, or Observation.
5. Review results and generate findings reports.

### Step 12 — Raise CAPAs for Findings

1. Go to **CAPAs** in the sidebar.
2. Click **New CAPA** to create a Corrective or Preventive Action.
3. Link it to the audit finding or risk that triggered it.
4. Define root cause, planned actions, and target completion date.
5. Assign to a team member and track progress through to closure.

### Step 13 — Track Training

1. Navigate to **Training** in the sidebar.
2. Record training requirements for ISO awareness and specific controls.
3. Track who has completed training and who needs reminders.
4. Link training records to compliance requirements.

### Step 14 — Monitor Your Dashboard

1. Return to the **Dashboard** for your compliance overview.
2. Review widgets: compliance scores, overdue tasks, upcoming audits, risk summary.
3. Use the **Reports** page to generate compliance reports and trend analyses.
4. Iterate through the PDCA cycle as your organisation matures.

---

## Feature Guide

| Module | Description |
|---|---|
| **Dashboard** | Compliance status at a glance — risk heat maps, task summaries, upcoming deadlines, and recent activity |
| **Frameworks** | Browse ISO frameworks with full clause hierarchies and control lists; compliance percentage updates in real time |
| **Assessments** | Structured gap assessment wizard with maturity ratings per control; results include gap analysis charts |
| **Statement of Applicability** | Central control register showing applicability and implementation status — a key ISO certification deliverable |
| **Risks** | Full risk register with 5×5 likelihood/impact scoring, treatment plans, and control linkage |
| **Tasks (Kanban)** | Drag-and-drop Kanban board with priority levels, assignees, due dates, and full traceability to controls/risks/CAPAs |
| **Documents** | Upload and manage policies, procedures, and records; link documents to controls as evidence |
| **Audits** | Plan and conduct internal audits; record findings and track non-conformities through to closure |
| **CAPAs** | Manage corrective and preventive actions with root cause analysis, planned actions, and effectiveness verification |
| **Evidence** | Attach evidence artifacts to controls — documents, screenshots, configuration exports, and other records |
| **Training** | Track training requirements and completions; ensure personnel competence and awareness |
| **Reports** | Generate compliance reports, trend analyses, and management review inputs with charts |
| **Settings** | Organisation settings, member management, and role assignment (Admin only) |
| **Multi-org** | Users can belong to multiple organisations and switch between them seamlessly |
| **Audit Log** | All significant actions are logged for traceability — a core ISO management system requirement |

---

## Roles & Permissions

| Permission | Admin | Manager | Auditor | Viewer |
|---|:---:|:---:|:---:|:---:|
| View dashboard & reports | ✓ | ✓ | ✓ | ✓ |
| Browse frameworks | ✓ | ✓ | ✓ | ✓ |
| View assessments & SoA | ✓ | ✓ | ✓ | ✓ |
| Run assessments | ✓ | ✓ | — | — |
| Update SoA | ✓ | ✓ | — | — |
| Manage risks | ✓ | ✓ | — | — |
| Create & manage tasks | ✓ | ✓ | — | — |
| Upload documents | ✓ | ✓ | — | — |
| Conduct audits | ✓ | — | ✓ | — |
| Manage CAPAs | ✓ | ✓ | — | — |
| Manage members | ✓ | — | — | — |
| Organisation settings | ✓ | — | — | — |
| Create organisations | ✓ | — | — | — |

---

## Architecture

```
certify-hub/
├── prisma/
│   ├── schema.prisma           # 26 models, 20+ enums
│   └── seed/
│       ├── index.ts
│       ├── demo-data.ts
│       ├── iso27001.ts         # ISO 27001:2022 — 93 Annex A controls
│       └── iso9001.ts          # ISO 9001:2015 — clauses & controls
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── org/[orgSlug]/ # Multi-tenant org routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── frameworks/
│   │   │   │   ├── assessments/
│   │   │   │   ├── soa/
│   │   │   │   ├── risks/
│   │   │   │   ├── tasks/
│   │   │   │   ├── documents/
│   │   │   │   ├── audits/
│   │   │   │   ├── capas/
│   │   │   │   ├── evidence/
│   │   │   │   ├── training/
│   │   │   │   ├── reports/
│   │   │   │   └── settings/
│   │   │   └── onboarding/
│   │   ├── (auth)/             # Login & register pages
│   │   └── api/                # Auth API routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── layout/             # App shell, sidebar, header
│   │   ├── shared/             # Reusable components
│   │   └── [module]/           # Module-specific components
│   └── lib/
│       ├── auth.ts             # NextAuth v5 configuration
│       ├── db.ts               # Prisma client singleton
│       ├── actions/            # Server actions (mutations)
│       └── queries/            # Data fetching functions
└── middleware.ts               # Auth route protection
```

### Key Design Decisions

| Decision | Approach |
|---|---|
| **Multi-tenancy** | Shared database with `orgId` on all tenant-scoped tables — no separate databases per tenant |
| **Mutations** | Next.js Server Actions with FormData; paths revalidated on change — no REST API layer |
| **Authentication** | NextAuth v5, JWT strategy, Prisma adapter, credentials provider; 30-day persistent sessions |
| **Authorization** | Role-based access control enforced in server actions via `requireAdmin()` helper pattern |
| **Data integrity** | Soft deletes via `deletedAt` timestamps — hard deletes never occur to preserve audit trails |

---

## Planned Features

### High Priority

- **Email notifications** — Alerts for task assignments, approaching due dates, audit schedules, and CAPA deadlines
- **Bulk control implementation** — Update multiple control statuses at once from the SoA view
- **Document versioning** — Revision history, approval workflows, and rollback support
- **Audit findings workflow** — Structured flow from finding → CAPA → verification → closure
- **Risk heat map** — Interactive 5×5 risk matrix with drill-down into individual risks
- **Dashboard customisation** — Configurable widget layout, date range filters, and per-framework views
- **PDF export** — Generate reports for management review, audit evidence packs, and SoA documents
- **Activity feed** — Real-time activity stream showing recent actions across the organisation
- **Control mapping** — Map equivalent controls across frameworks (e.g. ISO 27001 A.8.1 ↔ ISO 9001 7.1.3)
- **File attachments on tasks** — Attach working documents and evidence directly to tasks

### Medium Priority

- **REST API** — API key authenticated access for integration with external tools
- **Webhooks** — Trigger notifications on events: task completed, risk updated, audit scheduled
- **SSO / SAML** — Enterprise single sign-on via SAML 2.0 and OIDC
- **Two-factor authentication** — TOTP-based 2FA for enhanced account security
- **Recurring tasks** — Auto-create tasks on a schedule (monthly reviews, quarterly audits)
- **Custom fields** — User-defined metadata fields on risks, tasks, and CAPAs
- **Audit templates** — Pre-built checklists for surveillance, recertification, and other audit types
- **Evidence auto-collection** — Pull configuration evidence from AWS, Azure, and GCP automatically
- **Compliance timeline** — Visual certification journey with milestones and deadlines
- **Multi-language support** — Internationalisation for framework content and UI

### Nice to Have

- **AI gap analysis** — Suggest control implementations based on your organisation's context
- **AI risk suggestions** — Identify potential risks from your industry and organisation profile
- **Mobile app** — Native mobile experience for task management and audit fieldwork
- **Offline audit mode** — Conduct audits offline and sync when back online
- **Integration marketplace** — Jira, Slack, Teams, Confluence, and other tool connectors
- **White-labelling** — Custom branding per organisation: logo, colours, domain
- **Benchmark comparisons** — Compare compliance maturity against industry averages
- **Automated compliance scoring** — Continuously calculate scores from connected systems

---

## Upcoming Frameworks

### Information Security & Privacy

| Framework | Description | Status |
|---|---|:---:|
| **ISO 27001:2022** | Information security management systems | ✅ Available |
| **ISO 9001:2015** | Quality management systems | ✅ Available |
| **ISO 27701:2019** | Privacy information management (PIMS) | Planned |
| **ISO 27017:2015** | Cloud security controls | Planned |
| **ISO 27018:2019** | Protection of PII in public clouds | Planned |
| **SOC 2 Type II** | Trust services criteria | Planned |
| **NIST CSF 2.0** | Cybersecurity framework | Planned |
| **NIST 800-53 Rev 5** | Security & privacy controls for federal systems | Planned |
| **CIS Controls v8** | Critical security controls | Planned |
| **GDPR** | EU General Data Protection Regulation | Planned |
| **PCI DSS v4.0** | Payment card industry data security standard | Planned |

### Quality & Operations

| Framework | Description | Status |
|---|---|:---:|
| **ISO 14001:2015** | Environmental management systems | Planned |
| **ISO 45001:2018** | Occupational health and safety | Planned |
| **ISO 22301:2019** | Business continuity management | Planned |
| **ISO 20000-1:2018** | IT service management | Planned |
| **ISO 31000:2018** | Risk management guidelines | Planned |
| **ISO 42001:2023** | AI management systems | Planned |

### Industry-Specific

| Framework | Description | Status |
|---|---|:---:|
| **ISO 13485:2016** | Medical devices quality management | Planned |
| **ISO/IEC 17025:2017** | Testing and calibration laboratories | Planned |
| **HIPAA** | US health information privacy and security | Planned |
| **TISAX** | Trusted information security assessment (automotive) | Planned |
| **SWIFT CSP** | Customer security programme (financial services) | Planned |

### Regional & Emerging

| Framework | Description | Status |
|---|---|:---:|
| **NIS2 Directive** | EU network and information security directive | Planned |
| **DORA** | EU Digital Operational Resilience Act (financial) | Planned |
| **Cyber Essentials** | UK government-backed cybersecurity scheme | Planned |
| **Essential Eight** | Australian Signals Directorate maturity model | Planned |
| **CSA STAR** | Cloud Security Alliance security trust assurance | Planned |

Want a specific framework prioritised? [Open an issue](https://github.com/DonkeyXBT/certify-hub/issues).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://typescriptlang.org) |
| Database | [PostgreSQL 14+](https://postgresql.org) |
| ORM | [Prisma 6](https://prisma.io) |
| Auth | [NextAuth v5](https://authjs.dev) (Auth.js) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Charts | [Recharts](https://recharts.org) |
| File Storage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| Drag & Drop | Native HTML5 API |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with CertifyHub &mdash; start your compliance journey today.
</div>
