import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getTasksForKanban } from "@/lib/queries/tasks"
import { getMembers } from "@/lib/queries/members"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

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

  const [tasks, members, controlImpls, risks, capas] = await Promise.all([
    getTasksForKanban(org.id),
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

      <KanbanBoard initialTasks={tasks} orgSlug={orgSlug} />
    </div>
  )
}
