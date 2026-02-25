import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getTrainingProgramById } from "@/lib/queries/training"
import { getMembers } from "@/lib/queries/members"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AssignUsersDialog } from "@/components/training/assign-users-dialog"
import { DeleteProgramButton } from "@/components/training/delete-program-button"
import {
  StatusBadge,
  TrainingRecordActions,
} from "@/components/training/training-record-actions"
import { MyTrainingSection } from "@/components/training/my-training-section"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowLeft, Users, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

export default async function TrainingProgramPage({
  params,
}: {
  params: Promise<{ orgSlug: string; programId: string }>
}) {
  const { orgSlug, programId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const program = await getTrainingProgramById(programId)
  if (!program || program.orgId !== org.id) notFound()

  const members = await getMembers(org.id)
  const alreadyAssigned = program.records.map((r) => r.userId)

  // Determine current user's role and training record
  const myMembership = members.find((m) => m.user.id === session.user.id)
  const isAdmin =
    myMembership?.role === "ADMIN" || myMembership?.role === "MANAGER"

  const myRawRecord = program.records.find((r) => r.user.id === session.user.id)
  const myTrainingRecord = myRawRecord
    ? {
        id: myRawRecord.id,
        status: myRawRecord.status,
        score: myRawRecord.score,
        startedAt: myRawRecord.startedAt,
        completedAt: myRawRecord.completedAt,
        program: {
          id: program.id,
          title: program.title,
          description: program.description,
          isMandatory: program.isMandatory,
          passingScore: program.passingScore,
        },
      }
    : null

  const total = program.records.length
  const completed = program.records.filter((r) => r.status === "COMPLETED").length
  const inProgress = program.records.filter((r) => r.status === "IN_PROGRESS").length
  const overdue = program.records.filter((r) => r.status === "OVERDUE").length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const frequencyLabel: Record<string, string> = {
    ONE_TIME: "One-time",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    SEMI_ANNUAL: "Semi-annual",
    ANNUAL: "Annual",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/org/${orgSlug}/training`}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Training
        </Link>
        <span>/</span>
        <span className="text-foreground">{program.title}</span>
      </div>

      <PageHeader
        title={program.title}
        description={program.description ?? undefined}
        actions={
          isAdmin ? (
            <div className="flex items-center gap-2">
              <AssignUsersDialog
                programId={programId}
                orgSlug={orgSlug}
                members={members}
                alreadyAssigned={alreadyAssigned}
              />
              <DeleteProgramButton
                programId={programId}
                orgSlug={orgSlug}
                programTitle={program.title}
              />
            </div>
          ) : null
        }
      />

      {/* Self-service training section for current user */}
      {myTrainingRecord && (
        <MyTrainingSection records={[myTrainingRecord]} orgSlug={orgSlug} />
      )}

      {/* Admin-only: stats, metadata, and full management table */}
      {isAdmin && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completed}</div>
                <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overdue}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {program.frequency && (
                <Badge variant="outline">
                  {frequencyLabel[program.frequency] ?? program.frequency}
                </Badge>
              )}
              {program.isMandatory && (
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  Mandatory
                </Badge>
              )}
              {program.validityPeriod && (
                <span>Valid for {program.validityPeriod} days</span>
              )}
              {program.passingScore && (
                <span>Passing score: {program.passingScore}%</span>
              )}
            </div>
          </div>

          {program.records.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No users assigned yet</p>
              <p className="text-sm mt-1">
                Use the &quot;Assign Users&quot; button to enroll team members.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {program.records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {record.user.name ?? "Unnamed"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {record.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>
                        {record.score !== null ? `${record.score}%` : "—"}
                      </TableCell>
                      <TableCell>
                        {record.startedAt
                          ? format(new Date(record.startedAt), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {record.completedAt
                          ? format(new Date(record.completedAt), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <TrainingRecordActions
                          recordId={record.id}
                          currentStatus={record.status}
                          orgSlug={orgSlug}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
