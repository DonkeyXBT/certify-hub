import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
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
import { GraduationCap, Plus } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training"
        description="Manage training programs and track completion"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Program
          </Button>
        }
      />

      {programsWithStats.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No training programs"
          description="Create training programs to ensure your team maintains the necessary competencies."
        />
      ) : (
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
                <TableRow key={program.id}>
                  <TableCell className="font-medium">
                    {program.title}
                  </TableCell>
                  <TableCell>{program.frequency ?? "—"}</TableCell>
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
      )}
    </div>
  )
}
