import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export async function ComplianceScoreCards({ orgId }: { orgId: string }) {
  const assessments = await db.assessment.findMany({
    where: { orgId, status: "COMPLETED" },
    include: { framework: true, responses: true },
    orderBy: { updatedAt: "desc" },
    take: 4,
  })

  if (assessments.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Assessment</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Run an assessment to see scores</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculate stats
  const totalControls = await db.controlImplementation.count({ where: { orgId } })
  const implementedControls = await db.controlImplementation.count({ where: { orgId, status: "FULLY_IMPLEMENTED" } })
  const openRisks = await db.risk.count({ where: { orgId, deletedAt: null, status: { not: "CLOSED" } } })
  const openTasks = await db.task.count({ where: { orgId, deletedAt: null, status: { in: ["TODO", "IN_PROGRESS"] } } })

  const implRate = totalControls > 0 ? Math.round((implementedControls / totalControls) * 100) : 0

  const stats = [
    { title: "Control Implementation", value: `${implRate}%`, icon: Shield, description: `${implementedControls} of ${totalControls} controls`, progress: implRate },
    { title: "Latest Assessment", value: assessments[0]?.overallScore ? `${Math.round(assessments[0].overallScore)}%` : "N/A", icon: CheckCircle, description: assessments[0]?.framework?.name ?? "No framework" },
    { title: "Open Risks", value: openRisks.toString(), icon: AlertTriangle, description: "Requiring attention" },
    { title: "Pending Tasks", value: openTasks.toString(), icon: XCircle, description: "To be completed" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            {stat.progress !== undefined && (
              <Progress value={stat.progress} className="mt-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
