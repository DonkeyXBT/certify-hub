import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getAuditById } from "@/lib/queries/audits"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, CheckSquare, AlertCircle } from "lucide-react"
import { format } from "date-fns"

const findingSeverityColorMap: Record<string, string> = {
  OBSERVATION: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  OPPORTUNITY_FOR_IMPROVEMENT: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  MINOR_NONCONFORMITY: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  MAJOR_NONCONFORMITY: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
}

const findingStatusColorMap: Record<string, string> = {
  OPEN: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  CORRECTIVE_ACTION_TAKEN: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  VERIFIED: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  CLOSED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
}

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; auditId: string }>
}) {
  const { orgSlug, auditId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const audit = await getAuditById(auditId, org.id)
  if (!audit) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={audit.title}
        description={`${audit.type.replace(/_/g, " ")} Audit`}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/audits`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Audits
            </Link>
          </Button>
        }
      />

      {/* Status and metadata */}
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={audit.status} variant="audit" />
        <Badge variant="outline" className="capitalize">
          {audit.type.replace(/_/g, " ").toLowerCase()}
        </Badge>
        {audit.startDate && (
          <span className="text-sm text-muted-foreground">
            Start: {format(audit.startDate, "MMM d, yyyy")}
          </span>
        )}
        {audit.endDate && (
          <span className="text-sm text-muted-foreground">
            End: {format(audit.endDate, "MMM d, yyyy")}
          </span>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checklist">
            Checklist ({audit.checklistItems.length})
          </TabsTrigger>
          <TabsTrigger value="findings">
            Findings ({audit.findings.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {audit.scope && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scope</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {audit.scope}
                  </p>
                </CardContent>
              </Card>
            )}
            {audit.objectives && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {audit.objectives}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {audit.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {audit.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Team members */}
          {audit.teamMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Audit Team
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audit.teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.user.name ?? "—"}
                        </TableCell>
                        <TableCell>{member.user.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="mt-4">
          {audit.checklistItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                <CheckSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                No checklist items have been added to this audit.
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clause</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.checklistItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">
                        {item.clauseReference}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {item.question}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={item.complianceStatus}
                          variant="compliance"
                        />
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {item.notes ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings" className="mt-4">
          {audit.findings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                No findings have been recorded for this audit.
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.findings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell className="font-medium">
                        {finding.title}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={finding.severity}
                          colorMap={findingSeverityColorMap}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={finding.status}
                          colorMap={findingStatusColorMap}
                        />
                      </TableCell>
                      <TableCell>
                        {finding.dueDate
                          ? format(finding.dueDate, "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {format(finding.createdAt, "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
