import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { PageHeader } from "@/components/layout/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Shield,
  AlertTriangle,
  ClipboardList,
  BarChart3,
} from "lucide-react"

const reportTypes = [
  {
    title: "Compliance Report",
    description:
      "Overview of compliance posture across frameworks, including control implementation status and assessment results.",
    icon: Shield,
    href: "compliance",
  },
  {
    title: "Risk Summary",
    description:
      "Summary of the risk register including risk distribution by level, treatment status, and trending analysis.",
    icon: AlertTriangle,
    href: "risk-summary",
  },
  {
    title: "Audit Report",
    description:
      "Consolidated audit findings, nonconformity tracking, and corrective action status across all audits.",
    icon: ClipboardList,
    href: "audit",
  },
  {
    title: "Management Review",
    description:
      "Executive summary for management review meetings including KPIs, trends, and improvement opportunities.",
    icon: BarChart3,
    href: "management-review",
  },
]

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and view compliance reports for stakeholders"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <Link
              key={report.href}
              href={`/org/${orgSlug}/reports/${report.href}`}
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{report.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
