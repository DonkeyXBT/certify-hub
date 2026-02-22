import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getRiskStats } from "@/lib/queries/risks"
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
import { ArrowLeft, AlertTriangle } from "lucide-react"

const levelColors: Record<string, string> = {
  LOW: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  CRITICAL: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
}

export default async function RiskSummaryReportPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const stats = await getRiskStats(org.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Summary Report"
        description="Overview of the organizational risk profile"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/reports`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
        }
      />

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Risks</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Identified risks in the register
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open Risks</CardDescription>
            <CardTitle className="text-3xl">{stats.openCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Risks requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Closed Risks</CardDescription>
            <CardTitle className="text-3xl">
              {stats.total - stats.openCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Risks that have been resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Inherent Risk Distribution
              </div>
            </CardTitle>
            <CardDescription>Risk levels before controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(
                Object.entries(stats.byInherentLevel) as [string, number][]
              ).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={levelColors[level]}>
                      {level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width:
                            stats.total > 0
                              ? `${(count / stats.total) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Residual Risk Distribution
              </div>
            </CardTitle>
            <CardDescription>Risk levels after controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(
                Object.entries(stats.byResidualLevel) as [string, number][]
              ).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={levelColors[level]}>
                      {level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width:
                            stats.total > 0
                              ? `${(count / stats.total) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
