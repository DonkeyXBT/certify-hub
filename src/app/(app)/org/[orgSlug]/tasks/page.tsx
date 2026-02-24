import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import {
  getGeneralTasksForKanban,
  getActiveAssessmentsWithTasks,
  getTasksForKanbanByAssessment,
} from "@/lib/queries/tasks"
import { getMembers } from "@/lib/queries/members"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { AssessmentKanbanTabs } from "@/components/tasks/assessment-kanban-tabs"

export default async function TasksPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const [generalTasks, activeAssessments, members, controlImpls, risks, capas] =
    await Promise.all([
      getGeneralTasksForKanban(org.id),
      getActiveAssessmentsWithTasks(org.id),
      getMembers(org.id),
      db.controlImplementation.findMany({
        where: { orgId: org.id },
        include: { control: { select: { number: true, title: true } } },
        orderBy: { control: { number: "asc" } },
      }),
      db.risk.findMany({
        where: { orgId: org.id, deletedAt: null },
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
      db.cAPA.findMany({
        where: { orgId: org.id, deletedAt: null },
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
    ])

  // Fetch tasks for each active assessment in parallel
  const assessmentTaskSets = await Promise.all(
    activeAssessments.map(async (assessment) => ({
      assessment,
      tasks: await getTasksForKanbanByAssessment(org.id, assessment.id),
    }))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Track and manage compliance tasks and action items"
        actions={
          <CreateTaskDialog
            orgId={org.id}
            orgSlug={orgSlug}
            members={members}
            controls={controlImpls}
            risks={risks}
            capas={capas}
          />
        }
      />

      <AssessmentKanbanTabs
        generalTasks={generalTasks}
        assessmentTaskSets={assessmentTaskSets}
        orgSlug={orgSlug}
        members={members}
        controls={controlImpls}
        risks={risks}
        capas={capas}
      />
    </div>
  )
}
