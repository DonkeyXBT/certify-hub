# CertifyHub

A multi-tenant Governance, Risk & Compliance (GRC) platform for managing ISO certification journeys. Built with Next.js, Prisma, and PostgreSQL.

CertifyHub guides organisations through the full Plan-Do-Check-Act (PDCA) cycle for ISO standards — from initial gap assessment through control implementation, evidence collection, internal audits, and continuous improvement.

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

- Node.js 18+
- PostgreSQL 14+
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/DonkeyXBT/certify-hub.git
cd certify-hub
npm install
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/certifyhub"
AUTH_SECRET="your-random-secret-here"       # Generate with: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Create the database tables
npx prisma db push

# Seed with ISO frameworks + demo accounts
npx prisma db seed
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

---

## Demo Accounts

The seed script creates four demo users, all belonging to the "Acme Corp" organisation:

| Email | Password | Role | Access Level |
|-------|----------|------|-------------|
| `admin@example.com` | `password123` | Admin | Full access — manage members, settings, all modules |
| `auditor@example.com` | `password123` | Auditor | Read-only across all modules, manage audits |
| `manager@example.com` | `password123` | Manager | Manage risks, tasks, documents, CAPAs |
| `viewer@example.com` | `password123` | Viewer | Read-only access to all modules |

---

## How It Works

CertifyHub follows the **Plan-Do-Check-Act (PDCA)** cycle, the backbone of every ISO management system:

```
        ┌─────────────────────────────────────────────┐
        │                                             │
   ┌────▼────┐    ┌─────────┐    ┌───────┐    ┌─────┴───┐
   │  PLAN   │───▶│   DO    │───▶│ CHECK │───▶│   ACT   │
   │         │    │         │    │       │    │         │
   │ Gap     │    │ Implement│   │ Audit │    │ CAPA    │
   │ Assess  │    │ Controls │   │ Review│    │ Improve │
   │ Risk ID │    │ Evidence │   │ Assess│    │ Iterate │
   └─────────┘    └─────────┘    └───────┘    └─────────┘
```

1. **PLAN** — Browse your chosen ISO framework, run a gap assessment to identify where you stand, and register risks.
2. **DO** — Implement controls mapped to framework clauses, assign tasks to your team, upload evidence documents.
3. **CHECK** — Conduct internal audits, review the Statement of Applicability (SoA), and track compliance progress.
4. **ACT** — Raise CAPAs (Corrective and Preventive Actions) for non-conformities, close out findings, and continuously improve.

---

## Step-by-Step: Your First ISO Framework

Here is how to take your organisation from zero to audit-ready using CertifyHub:

### Step 1: Sign Up and Create Your Organisation

1. Navigate to the login page and sign in (or use a demo account).
2. On first login, you'll land on the onboarding page. Enter your organisation name and slug.
3. You'll be taken to your organisation dashboard.

### Step 2: Add Team Members

1. Go to **Settings > Members** from the sidebar.
2. As an Admin, use the "Add Member" form to invite colleagues by email.
3. Assign each person an appropriate role (Admin, Manager, Auditor, or Viewer).

### Step 3: Browse Available Frameworks

1. Click **Frameworks** in the sidebar.
2. You'll see published frameworks (ISO 27001:2022 and ISO 9001:2015 are pre-seeded).
3. Each card shows the number of clauses, controls, and your current compliance percentage.

### Step 4: Explore a Framework

1. Click on a framework card to see its detail page.
2. The **Clauses** tab shows the hierarchical clause structure (e.g. Clause 4 > 4.1 > 4.1.1).
3. The **Controls** tab lists all controls with their descriptions and implementation guidance.
4. The compliance progress bar at the top shows your overall status.

### Step 5: Run a Gap Assessment

1. Go to **Assessments** in the sidebar.
2. Click **New Assessment** and select the framework.
3. Walk through the assessment wizard — for each control, rate your current maturity level and add notes.
4. Submit the assessment to see your gap analysis results and charts.

### Step 6: Review the Statement of Applicability (SoA)

1. Navigate to **Statement of Applicability** in the sidebar.
2. The SoA lists every control with its applicability status and implementation status.
3. Mark controls as applicable or not applicable with justification.
4. Track implementation status: Not Implemented, Partially Implemented, or Fully Implemented.

### Step 7: Identify and Register Risks

1. Go to **Risks** in the sidebar.
2. Click **Add Risk** to register a risk.
3. Fill in: title, description, category, likelihood (1-5), impact (1-5).
4. The risk score is calculated automatically (likelihood x impact).
5. Set a treatment plan: Mitigate, Accept, Transfer, or Avoid.
6. Link the risk to relevant controls from the SoA.

### Step 8: Create and Assign Tasks

1. Go to **Tasks** in the sidebar.
2. The Kanban board shows four columns: To Do, In Progress, In Review, and Done.
3. Click **Add Task** to create a new task.
4. Fill in: title, description, priority, assignee, due date.
5. Optionally link the task to a specific control, risk, or CAPA.
6. Drag cards between columns to update status.

### Step 9: Implement Controls

1. From the SoA or framework detail page, select a control to implement.
2. Update its implementation status as you make progress.
3. Link tasks to the control so your team knows what work is required.
4. Watch your compliance percentage climb on the framework page.

### Step 10: Upload Evidence Documents

1. Go to **Documents** in the sidebar.
2. Upload policies, procedures, records, and other evidence.
3. Categorise documents (Policy, Procedure, Record, Form, Guide, etc.).
4. Link documents to specific controls as evidence of implementation.

### Step 11: Conduct Internal Audits

1. Navigate to **Audits** in the sidebar.
2. Create a new audit, selecting the scope (which clauses/controls to audit).
3. Assign auditors and set the audit schedule.
4. During the audit, record findings: conformity, minor non-conformity, major non-conformity, or observation.
5. Review audit results and generate findings reports.

### Step 12: Raise CAPAs for Findings

1. Go to **CAPAs** in the sidebar.
2. Click **New CAPA** to create a Corrective or Preventive Action.
3. Link it to the audit finding or risk that triggered it.
4. Define root cause, planned actions, and target completion date.
5. Assign the CAPA to a team member and track progress.

### Step 13: Track Training

1. Navigate to **Training** in the sidebar.
2. Record training requirements for ISO awareness and specific controls.
3. Track who has completed training and who needs reminders.
4. Link training records to compliance requirements.

### Step 14: Monitor Your Dashboard

1. Return to the **Dashboard** to see your compliance overview.
2. Review widgets: compliance scores, overdue tasks, upcoming audits, risk summary.
3. Use the **Reports** page to generate compliance reports and trend analyses.
4. Iterate through the PDCA cycle as your organisation matures.

---

## Feature Guide

### Dashboard
The main overview page with widgets showing compliance status at a glance, recent activity, upcoming deadlines, risk heat maps, and task summaries.

### Frameworks
Browse published ISO frameworks with their full clause hierarchies and control lists. Each framework shows your organisation's compliance percentage based on control implementation status.

### Assessments
Run structured gap assessments against a framework. The assessment wizard walks you through each control, letting you rate maturity levels. Results include gap analysis charts and scoring summaries.

### Statement of Applicability (SoA)
The central register of all controls, their applicability to your organisation, and their implementation status. This is a key ISO deliverable required for certification audits.

### Risks
Full risk register with likelihood/impact scoring (5x5 matrix), risk categories, treatment plans, and linkage to controls. Supports the risk-based thinking required by ISO standards.

### Tasks (Kanban Board)
Visual task management with drag-and-drop Kanban board. Tasks can be linked to controls, risks, or CAPAs to maintain traceability. Supports priority levels, assignees, and due dates.

### Documents
Document management system for policies, procedures, records, and forms. Supports file uploads with metadata, categorisation, and linking to controls as evidence.

### Audits
Plan and conduct internal audits. Create audit programs, assign auditors, record findings, and track non-conformities through to closure.

### CAPAs (Corrective & Preventive Actions)
Manage corrective and preventive actions arising from audit findings, incidents, or risk assessments. Track root cause analysis, planned actions, and verification of effectiveness.

### Evidence
Attach evidence artifacts to controls, showing proof of implementation. Evidence can include documents, screenshots, configuration exports, and other records.

### Training
Track training requirements and completions. Ensure personnel are competent and aware of their roles in the management system.

### Reports
Generate compliance reports, trend analyses, and management review inputs. Visualise progress over time with charts and summaries.

### Settings
Organisation settings, member management (add/remove users, assign roles), and configuration. Only accessible to Admin users.

### Organisation Switching
Users can belong to multiple organisations and switch between them seamlessly. Admins can create new organisations at any time.

### Audit Logging
All significant actions are logged for traceability — a requirement for ISO management systems. Logs capture who did what, when, and what changed.

---

## Roles & Permissions

| Permission | Admin | Manager | Auditor | Viewer |
|-----------|-------|---------|---------|--------|
| View dashboard & reports | Yes | Yes | Yes | Yes |
| Browse frameworks | Yes | Yes | Yes | Yes |
| View assessments & SoA | Yes | Yes | Yes | Yes |
| Run assessments | Yes | Yes | No | No |
| Update SoA | Yes | Yes | No | No |
| Manage risks | Yes | Yes | No | No |
| Create & manage tasks | Yes | Yes | No | No |
| Upload documents | Yes | Yes | No | No |
| Conduct audits | Yes | No | Yes | No |
| Manage CAPAs | Yes | Yes | No | No |
| Manage members | Yes | No | No | No |
| Organisation settings | Yes | No | No | No |
| Create organisations | Yes | No | No | No |

---

## Architecture

```
certify-hub/
├── prisma/
│   ├── schema.prisma          # 26 models, 20+ enums
│   └── seed/                  # ISO framework data + demo accounts
│       ├── index.ts
│       ├── demo-data.ts
│       ├── iso27001.ts        # ISO 27001:2022 (93 Annex A controls)
│       └── iso9001.ts         # ISO 9001:2015 clauses & controls
├── src/
│   ├── app/
│   │   ├── (app)/             # Authenticated app routes
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
│   │   ├── (auth)/            # Login/register pages
│   │   └── api/               # API routes (auth)
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── layout/            # App shell, sidebar, header
│   │   ├── shared/            # Reusable components
│   │   ├── frameworks/        # Framework-specific components
│   │   ├── assessments/       # Assessment wizard, charts
│   │   ├── tasks/             # Kanban board, task cards
│   │   └── ...                # Module-specific components
│   └── lib/
│       ├── auth.ts            # NextAuth v5 configuration
│       ├── db.ts              # Prisma client singleton
│       ├── actions/           # Server actions (mutations)
│       └── queries/           # Data fetching functions
└── middleware.ts              # Auth route protection
```

**Key design decisions:**

- **Multi-tenancy**: Shared database with `orgId` on all tenant-scoped tables. No separate databases per tenant.
- **Server Actions**: All mutations use Next.js Server Actions (no REST API). Actions accept FormData and revalidate paths.
- **Auth**: NextAuth v5 with JWT strategy, Prisma adapter, credentials provider. 30-day persistent sessions with secure cookies.
- **RBAC**: Role-based access control enforced in server actions with a `requireAdmin()` helper pattern.
- **Soft deletes**: Records use `deletedAt` timestamps rather than hard deletes for audit trail preservation.

---

## Planned Features

### High Priority

- **Email notifications** — Send email alerts for task assignments, approaching due dates, audit schedules, and CAPA deadlines
- **Bulk control implementation** — Update multiple control statuses at once from the SoA view
- **Document versioning** — Track document revisions with version history, approval workflows, and rollback
- **Audit findings workflow** — Structured workflow from finding to CAPA to verification to closure
- **Risk heat map visualisation** — Interactive 5x5 risk matrix with drill-down into individual risks
- **Dashboard customisation** — Configurable widget layout, date range filters, and per-framework dashboards
- **Export to PDF** — Generate PDF reports for management review, audit evidence packs, and SoA documents
- **Activity feed** — Real-time activity stream on the dashboard showing recent actions across the org
- **Control mapping** — Map controls across frameworks (e.g. ISO 27001 A.8.1 maps to ISO 9001 7.1.3)
- **File attachments on tasks** — Attach files directly to tasks as working documents or evidence

### Medium Priority

- **API access** — REST API with API key authentication for integration with external tools
- **Webhook notifications** — Trigger webhooks on events (task completed, risk updated, audit scheduled)
- **SSO / SAML** — Enterprise single sign-on via SAML 2.0 and OIDC providers
- **Two-factor authentication** — TOTP-based 2FA for enhanced account security
- **Recurring tasks** — Automatically create tasks on a schedule (monthly reviews, quarterly audits)
- **Custom fields** — User-defined fields on risks, tasks, and CAPAs for org-specific metadata
- **Audit templates** — Pre-built audit checklists for common audit types (surveillance, recertification)
- **Evidence auto-collection** — Integrate with cloud providers (AWS, Azure, GCP) to automatically pull configuration evidence
- **Compliance timeline** — Visual timeline showing the certification journey with milestones and deadlines
- **Multi-language support** — Internationalisation for framework content and UI

### Nice to Have

- **AI-powered gap analysis** — Use AI to suggest control implementations based on your organisation's context
- **AI risk suggestions** — Automatically identify potential risks from your industry and organisation profile
- **Mobile app** — Native mobile experience for task management and audit fieldwork
- **Offline audit mode** — Conduct audits offline and sync findings when back online
- **Integration marketplace** — Connect with Jira, Slack, Teams, Confluence, and other tools
- **Tenant white-labelling** — Custom branding (logo, colours, domain) per organisation
- **Benchmark comparisons** — Compare your compliance maturity against industry averages
- **Automated compliance scoring** — Continuously calculate compliance scores from connected systems

---

## Upcoming Frameworks

### Information Security & Privacy

| Framework | Description | Status |
|-----------|-------------|--------|
| **ISO 27001:2022** | Information security management systems | Available |
| **ISO 27701:2019** | Privacy information management (PIMS extension to 27001) | Planned |
| **ISO 27017:2015** | Cloud security controls | Planned |
| **ISO 27018:2019** | Protection of PII in public clouds | Planned |
| **SOC 2 Type II** | Trust services criteria (Security, Availability, etc.) | Planned |
| **NIST CSF 2.0** | Cybersecurity framework (Govern, Identify, Protect, Detect, Respond, Recover) | Planned |
| **NIST 800-53 Rev 5** | Security and privacy controls for federal systems | Planned |
| **CIS Controls v8** | Center for Internet Security critical security controls | Planned |
| **GDPR** | EU General Data Protection Regulation controls | Planned |
| **PCI DSS v4.0** | Payment card industry data security standard | Planned |

### Quality & Operations

| Framework | Description | Status |
|-----------|-------------|--------|
| **ISO 9001:2015** | Quality management systems | Available |
| **ISO 14001:2015** | Environmental management systems | Planned |
| **ISO 45001:2018** | Occupational health and safety | Planned |
| **ISO 22301:2019** | Business continuity management | Planned |
| **ISO 20000-1:2018** | IT service management | Planned |
| **ISO 31000:2018** | Risk management guidelines | Planned |
| **ISO 42001:2023** | AI management systems | Planned |

### Industry-Specific

| Framework | Description | Status |
|-----------|-------------|--------|
| **ISO 13485:2016** | Medical devices quality management | Planned |
| **ISO/IEC 17025:2017** | Testing and calibration laboratories | Planned |
| **HIPAA** | US health information privacy and security | Planned |
| **TISAX** | Trusted information security assessment (automotive) | Planned |
| **SWIFT CSP** | Customer security programme (financial services) | Planned |

### Regional & Emerging

| Framework | Description | Status |
|-----------|-------------|--------|
| **NIS2 Directive** | EU network and information security directive | Planned |
| **DORA** | EU Digital Operational Resilience Act (financial) | Planned |
| **Cyber Essentials** | UK government-backed cybersecurity scheme | Planned |
| **Essential Eight** | Australian Signals Directorate maturity model | Planned |
| **CSA STAR** | Cloud Security Alliance security trust assurance | Planned |

Want a specific framework prioritised? Open an issue on the repository.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth v5 (Auth.js) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Drag & Drop | Native HTML5 API |

---

## License

MIT

---

Built with CertifyHub. Start your compliance journey today.
