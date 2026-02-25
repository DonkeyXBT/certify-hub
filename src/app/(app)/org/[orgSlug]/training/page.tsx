import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
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
import { EmptyState } from "@/components/shared/empty-state"
import { CreateProgramDialog } from "@/components/training/create-program-dialog"
import { MyTrainingSection } from "@/components/training/my-training-section"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import type { OrgRole } from "@prisma/client"

const ADMIN_ROLES: OrgRole[] = ["ADMIN", "MANAGER"]

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  // Determine the current user's role in this org
  const membership = await db.membership.findUnique({
    where: { userId_orgId: { userId: session.user.id, orgId: org.id } },
    select: { role: true },
  })
  const isAdmin = membership ? ADMIN_ROLES.includes(membership.role) : false

  // Fetch all programs with stats
  const programs = await db.trainingProgram.findMany({
    where: { orgId: org.id },
    include: {
      _count: {
        select: { records: true },
      },
      records: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch current user's own training records for this org
  const myRecords = await db.trainingRecord.findMany({
    where: {
      userId: session.user.id,
      program: { orgId: org.id },
    },
    include: {
      program: {
        select: {
          id: true,
          title: true,
          description: true,
          isMandatory: true,
          passingScore: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  const programsWithStats = programs.map((program) => {
    const total = program._count.records
    const completed = program.records.filter(
      (r) => r.status === "COMPLETED"
    ).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      id: program.id,
      title: program.title,
      frequency: program.frequency,
      isMandatory: program.isMandatory,
      enrolled: total,
      completionRate,
    }
  })

  const frequencyLabel: Record<string, string> = {
    ONE_TIME: "One-time",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    SEMI_ANNUAL: "Semi-annual",
    ANNUAL: "Annual",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training"
        description="Manage training programs and track completion"
        actions={
          isAdmin ? <CreateProgramDialog orgId={org.id} orgSlug={orgSlug} /> : undefined
        }
      />

      {/* My Training section — shown to all members with assigned records */}
      {myRecords.length > 0 && (
        <MyTrainingSection records={myRecords} orgSlug={orgSlug} />
      )}

      {/* Program overview — always shown */}
      {programsWithStats.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No training programs"
          description="Create training programs to ensure your team maintains the necessary competencies."
        />
      ) : (
        <div className="space-y-2">
          {isAdmin && (
            <h2 className="text-sm font-medium text-muted-foreground">All Programs</h2>
          )}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Mandatory</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programsWithStats.map((program) => (
                  <TableRow key={program.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link
                        href={`/org/${orgSlug}/training/${program.id}`}
                        className="hover:underline"
                      >
                        {program.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {program.frequency
                        ? frequencyLabel[program.frequency] ?? program.frequency
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {program.isMandatory ? (
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
                        >
                          Required
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        >
                          Optional
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{program.enrolled}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${program.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {program.completionRate}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
