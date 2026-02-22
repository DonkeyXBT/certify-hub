import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getRiskById } from "@/lib/queries/risks"
import { PageHeader } from "@/components/layout/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Shield } from "lucide-react"
import { format } from "date-fns"

export default async function RiskDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; riskId: string }>
}) {
  const { orgSlug, riskId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const risk = await getRiskById(riskId)
  if (!risk) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={risk.title}
        description={risk.category?.name ?? undefined}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/risks`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Risks
            </Link>
          </Button>
        }
      />

      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={risk.status} colorMap={{
          IDENTIFIED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
          ANALYSED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
          TREATMENT_PLANNED: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
          TREATMENT_IN_PROGRESS: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
          TREATED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
          CLOSED: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
          MONITORING: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
        }} />
        <Badge variant="outline" className="capitalize">
          {risk.treatment.toLowerCase()}
        </Badge>
        {risk.owner && (
          <span className="text-sm text-muted-foreground">
            Owner: {risk.owner}
          </span>
        )}
      </div>

      {/* Risk scores */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inherent Risk</CardTitle>
            <CardDescription>Risk before controls are applied</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{risk.inherentScore}</div>
              <StatusBadge status={risk.inherentLevel} variant="risk" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>Likelihood: {risk.inherentLikelihood.replace(/_/g, " ")}</div>
              <div>Impact: {risk.inherentImpact.replace(/_/g, " ")}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Residual Risk</CardTitle>
            <CardDescription>Risk after controls are applied</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{risk.residualScore}</div>
              <StatusBadge status={risk.residualLevel} variant="risk" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>Likelihood: {risk.residualLikelihood.replace(/_/g, " ")}</div>
              <div>Impact: {risk.residualImpact.replace(/_/g, " ")}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description and treatment plan */}
      {(risk.description || risk.treatmentPlan) && (
        <div className="grid gap-6 md:grid-cols-2">
          {risk.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {risk.description}
                </p>
              </CardContent>
            </Card>
          )}
          {risk.treatmentPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Treatment Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {risk.treatmentPlan}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Review date */}
      {risk.reviewDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{format(risk.reviewDate, "MMMM d, yyyy")}</p>
          </CardContent>
        </Card>
      )}

      {/* Mapped controls */}
      {risk.controlMappings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Mapped Controls
              </div>
            </CardTitle>
            <CardDescription>
              Controls linked to mitigate this risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Control Number</TableHead>
                  <TableHead>Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risk.controlMappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-mono text-sm">
                      {mapping.controlImplementation.control.number}
                    </TableCell>
                    <TableCell>
                      {mapping.controlImplementation.control.title}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Linked tasks */}
      {risk.tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linked Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risk.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} variant="task" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={task.priority} variant="risk" />
                    </TableCell>
                    <TableCell>{task.assignee?.name ?? "—"}</TableCell>
                    <TableCell>
                      {task.dueDate
                        ? format(task.dueDate, "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
