import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
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
import { PriorityBadge } from "@/components/shared/priority-badge"
import type { Priority } from "@/components/shared/priority-badge"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"

export default async function CAPADetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; capaId: string }>
}) {
  const { orgSlug, capaId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const capa = await db.cAPA.findFirst({
    where: { id: capaId, orgId: org.id, deletedAt: null },
    include: {
      tasks: {
        where: { deletedAt: null },
        include: {
          assignee: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!capa) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={capa.title}
        description={capa.source ? `Source: ${capa.source}` : undefined}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/capa`}>
              <ArrowLeft className="h-4 w-4" />
              Back to CAPA
            </Link>
          </Button>
        }
      />

      {/* Status and metadata */}
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={capa.status} variant="capa" />
        <Badge variant="outline" className="capitalize">
          {capa.type.toLowerCase()}
        </Badge>
        {capa.dueDate && (
          <span className="text-sm text-muted-foreground">
            Due: {format(capa.dueDate, "MMM d, yyyy")}
          </span>
        )}
      </div>

      {/* CAPA details */}
      <div className="grid gap-6 md:grid-cols-2">
        {capa.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {capa.description}
              </p>
            </CardContent>
          </Card>
        )}

        {capa.immediateAction && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Immediate Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {capa.immediateAction}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Root cause analysis */}
      {(capa.rootCauseMethod || capa.rootCauseAnalysis) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Root Cause Analysis</CardTitle>
            {capa.rootCauseMethod && (
              <CardDescription>Method: {capa.rootCauseMethod}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {capa.rootCauseAnalysis && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {capa.rootCauseAnalysis}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {capa.correctiveAction && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Corrective Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {capa.correctiveAction}
              </p>
            </CardContent>
          </Card>
        )}

        {capa.preventiveAction && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preventive Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {capa.preventiveAction}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Verification */}
      {(capa.verificationMethod || capa.verificationResult) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Verification</CardTitle>
            {capa.verificationDate && (
              <CardDescription>
                Verified: {format(capa.verificationDate, "MMM d, yyyy")}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {capa.verificationMethod && (
              <div>
                <div className="text-sm font-medium mb-1">Method</div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {capa.verificationMethod}
                </p>
              </div>
            )}
            {capa.verificationResult && (
              <div>
                <div className="text-sm font-medium mb-1">Result</div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {capa.verificationResult}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Closure */}
      {(capa.closureDate || capa.closureNotes) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Closure</CardTitle>
            {capa.closureDate && (
              <CardDescription>
                Closed: {format(capa.closureDate, "MMM d, yyyy")}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {capa.closureNotes && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {capa.closureNotes}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Linked tasks */}
      {capa.tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linked Tasks</CardTitle>
            <CardDescription>
              {capa.tasks.length} task{capa.tasks.length !== 1 ? "s" : ""}
            </CardDescription>
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
                {capa.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} variant="task" />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={task.priority as Priority} />
                    </TableCell>
                    <TableCell>
                      {task.assignee?.name ?? task.assignee?.email ?? "Unassigned"}
                    </TableCell>
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
