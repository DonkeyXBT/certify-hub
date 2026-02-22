import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import { PriorityBadge } from "@/components/shared/priority-badge"
import type { Priority } from "@/components/shared/priority-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { ListTodo, Plus } from "lucide-react"
import { format } from "date-fns"

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

  const tasks = await db.task.findMany({
    where: { orgId: org.id, deletedAt: null },
    include: {
      assignee: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Track and manage compliance tasks and action items"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        }
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Create tasks to track compliance action items, risk treatments, and remediation activities."
        />
      ) : (
        <div className="rounded-md border">
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
              {tasks.map((task) => (
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
        </div>
      )}
    </div>
  )
}
