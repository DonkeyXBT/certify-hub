import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Shield,
  CheckCircle,
  BarChart3,
  FileText,
  AlertTriangle,
  Lock,
  ClipboardCheck,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react"

const FRAMEWORKS = [
  "ISO 27001:2022",
  "ISO 9001:2015",
  "GDPR",
  "NIS2",
  "SOC 2 Type II",
  "ISO 14001",
  "ISO 22301",
  "DORA",
]

const STATS = [
  { value: "8+", label: "Frameworks" },
  { value: "500+", label: "Controls" },
  { value: "100%", label: "Web-based" },
  { value: "Multi", label: "Tenant" },
]

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Gap Assessments",
    description:
      "Clause-by-clause assessments against any framework. Auto-score compliance posture and surface gaps instantly.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Management",
    description:
      "5×5 risk matrix, risk register, treatment plans, and full control mapping with residual risk tracking.",
  },
  {
    icon: Lock,
    title: "Control Library",
    description:
      "Built-in control sets for every supported framework. Track implementation status, evidence, and effectiveness.",
  },
  {
    icon: FileText,
    title: "Document Control",
    description:
      "Version tracking, approval workflows, and automated review cycles for all your compliance documentation.",
  },
  {
    icon: BarChart3,
    title: "Audit Management",
    description:
      "Plan internal and external audits, auto-generate checklists from controls, capture findings, and track remediation.",
  },
  {
    icon: Users,
    title: "Multi-Tenant Teams",
    description:
      "Role-based access across organisations. Admins, managers, auditors, and viewers — all with scoped permissions.",
  },
]

const STEPS = [
  {
    number: "01",
    icon: Shield,
    title: "Select your framework",
    description:
      "Choose from ISO 27001, ISO 9001, GDPR, NIS2, SOC 2 and more. Set your organisation scope and objectives.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Run a gap assessment",
    description:
      "Work through every control clause, set compliance status, and document identified gaps with recommendations.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Track to certification",
    description:
      "Generate tasks, manage evidence, assign owners, and follow your progress toward certification with full audit trail.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <Shield className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Certifi{" "}
              <span className="font-normal text-slate-500">by Cyfenced</span>
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400"
              asChild
            >
              <Link href="/login" className="flex items-center gap-1.5">
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">

          {/* dot grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* ambient glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-[140px]" />
          <div className="pointer-events-none absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-blue-600/6 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">

            {/* badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              GRC &amp; ISO Compliance Platform · by Cyfenced
            </div>

            {/* headline */}
            <h1 className="text-balance text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-slate-100">Compliance</span>
              <br />
              <span
                className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
              >
                engineered.
              </span>
              <br />
              <span className="text-slate-100">Certification</span>
              <br />
              <span className="text-slate-400">simplified.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
              Certifi is the all-in-one GRC workspace for teams pursuing ISO, GDPR, NIS2,
              and SOC 2 certification — gap assessments, risk registers, audit trails,
              and task management in a single platform.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 bg-cyan-500 px-8 font-semibold text-slate-950 hover:bg-cyan-400"
                asChild
              >
                <Link href="/login" className="flex items-center gap-2">
                  Start your assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-slate-700 bg-transparent px-8 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                asChild
              >
                <Link href="/login">Sign in to dashboard</Link>
              </Button>
            </div>

            {/* framework badges */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
              {FRAMEWORKS.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center rounded-md border border-slate-700/80 bg-slate-900/60 px-3 py-1 font-mono text-xs text-slate-400 backdrop-blur-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
        <section className="border-y border-slate-800/60 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={[
                    "flex flex-col items-center gap-1 px-4 text-center",
                    i < STATS.length - 1 ? "sm:border-r sm:border-slate-800" : "",
                  ].join(" ")}
                >
                  <span className="font-mono text-4xl font-bold text-cyan-400">
                    {s.value}
                  </span>
                  <span className="text-sm text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section className="py-28 px-6">
          <div className="mx-auto max-w-7xl">

            <div className="mb-16">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-cyan-500">
                Platform capabilities
              </p>
              <h2 className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
                Every tool your compliance team needs
              </h2>
              <p className="mt-3 max-w-xl text-slate-400">
                From first gap analysis to audit-ready — everything in one workspace,
                designed for the way compliance teams actually work.
              </p>
            </div>

            <div className="grid gap-px rounded-xl border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group relative bg-slate-950 p-8 transition-colors duration-200 hover:bg-slate-900"
                >
                  {/* hover accent line */}
                  <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-transform duration-300 group-hover:scale-x-100" />

                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 transition-colors duration-200 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10">
                    <f.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-slate-100">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="border-y border-slate-800/60 bg-slate-900/20 py-28 px-6">
          <div className="mx-auto max-w-7xl">

            <div className="mb-16 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-cyan-500">
                How it works
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Three steps to certified
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.number} className="relative">
                  {/* connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-5 left-full hidden w-full -translate-x-4 sm:block">
                      <div className="h-px bg-gradient-to-r from-slate-700 via-slate-700/50 to-transparent" />
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                        <step.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <span className="font-mono text-5xl font-bold leading-none text-slate-800">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="mb-2 font-semibold text-slate-100">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CERTIFI STRIP ────────────────────────────────────────────── */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Fast to deploy",
                  description:
                    "No installation, no configuration. Log in, create your organisation, and start your first assessment in minutes.",
                },
                {
                  icon: Lock,
                  title: "Secure by design",
                  description:
                    "Multi-tenant isolation, role-based access control, and full audit logging — built for security-conscious teams.",
                },
                {
                  icon: CheckCircle,
                  title: "Audit-ready output",
                  description:
                    "Every response, task, and piece of evidence is tracked and timestamped — ready to present to any auditor.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-6"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                    <item.icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-semibold text-slate-100">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 p-12 text-center">
              {/* subtle grid inside card */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-blue-600/5" />

              <div className="relative z-10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500">
                  <Shield className="h-7 w-7 text-slate-950" strokeWidth={2.5} />
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to get certified?
                </h2>
                <p className="mx-auto mb-8 max-w-md text-slate-400">
                  Join organisations using Certifi to manage their compliance journey —
                  from gap to certificate.
                </p>
                <Button
                  size="lg"
                  className="h-12 bg-cyan-500 px-8 font-semibold text-slate-950 hover:bg-cyan-400"
                  asChild
                >
                  <Link href="/login" className="flex items-center gap-2">
                    Get started today
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 py-8 px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500">
              <Shield className="h-3.5 w-3.5 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-slate-300">
              Certifi{" "}
              <span className="font-normal text-slate-600">by Cyfenced</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Cyfenced. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
