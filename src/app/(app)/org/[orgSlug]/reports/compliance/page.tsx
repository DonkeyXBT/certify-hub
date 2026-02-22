import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Clock } from "lucide-react"

export default async function ComplianceReportPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const [totalControls, implementedControls, partialControls, plannedControls, latestAssessment] =
    await Promise.all([
      db.controlImplementation.count({ where: { orgId: org.id } }),
      db.controlImplementation.count({
        where: { orgId: org.id, status: "FULLY_IMPLEMENTED" },
      }),
      db.controlImplementation.count({
        where: { orgId: org.id, status: "PARTIALLY_IMPLEMENTED" },
      }),
      db.controlImplementation.count({
        where: { orgId: org.id, status: "PLANNED" },
      }),
      db.assessment.findFirst({
        where: { orgId: org.id, status: "COMPLETED" },
        include: { framework: { select: { name: true } } },
        orderBy: { updatedAt: "desc" },
      }),
    ])

  const implRate =
    totalControls > 0
      ? Math.round((implementedControls / totalControls) * 100)
      : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Report"
        description="Overview of your organization's compliance posture"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/reports`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Implementation Rate</CardDescription>
            <CardTitle className="text-3xl">{implRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {implementedControls} of {totalControls} controls implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                Fully Implemented
              </div>
            </CardDescription>
            <CardTitle className="text-3xl">{implementedControls}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Controls fully in place</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
                Partially Implemented
              </div>
            </CardDescription>
            <CardTitle className="text-3xl">{partialControls}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Controls needing completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-yellow-600" />
                Planned
              </div>
            </CardDescription>
            <CardTitle className="text-3xl">{plannedControls}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Controls in planning stage</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Latest Assessment
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latestAssessment ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-medium">{latestAssessment.name}</span>
                <Badge variant="outline">{latestAssessment.framework.name}</Badge>
              </div>
              {latestAssessment.overallScore !== null && (
                <div className="text-sm text-muted-foreground">
                  Overall score: {Math.round(latestAssessment.overallScore)}%
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No completed assessments yet. Run an assessment to see compliance scores here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
