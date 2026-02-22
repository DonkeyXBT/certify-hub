import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getUserMembership } from "@/lib/queries/organization"
import { PageHeader } from "@/components/layout/page-header"
import { ComplianceScoreCards } from "@/components/dashboard/compliance-score-cards"
import { RiskSummaryCard } from "@/components/dashboard/risk-summary-card"
import { TaskSummaryCard } from "@/components/dashboard/task-summary-card"
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card"
import { UpcomingAuditsCard } from "@/components/dashboard/upcoming-audits-card"

export default async function DashboardPage({
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
        title="Dashboard"
        description={`Overview for ${org.name}`}
      />
      <ComplianceScoreCards orgId={org.id} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RiskSummaryCard orgId={org.id} />
        <TaskSummaryCard orgId={org.id} />
        <UpcomingAuditsCard orgId={org.id} />
      </div>
      <RecentActivityCard orgId={org.id} />
    </div>
  )
}
