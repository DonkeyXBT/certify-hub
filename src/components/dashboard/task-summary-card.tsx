import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ListTodo } from "lucide-react"

const TASK_STATUS_CONFIG = {
  TODO: { label: "To Do", variant: "outline" as const },
  IN_PROGRESS: { label: "In Progress", variant: "default" as const },
  IN_REVIEW: { label: "In Review", variant: "secondary" as const },
  COMPLETED: { label: "Completed", variant: "outline" as const },
  OVERDUE: { label: "Overdue", variant: "destructive" as const },
  CANCELLED: { label: "Cancelled", variant: "outline" as const },
} as const

type TaskStatusKey = keyof typeof TASK_STATUS_CONFIG

export async function TaskSummaryCard({ orgId }: { orgId: string }) {
  const tasks = await db.task.findMany({
    where: { orgId, deletedAt: null },
    select: { status: true, dueDate: true },
  })

  const grouped = tasks.reduce<Record<TaskStatusKey, number>>(
    (acc, task) => {
      const status = task.status as TaskStatusKey
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, COMPLETED: 0, OVERDUE: 0, CANCELLED: 0 }
  )

  // Count tasks that are past due but not yet marked as OVERDUE or completed
  const now = new Date()
  const pastDueCount = tasks.filter(
    (t) =>
      t.dueDate &&
      t.dueDate < now &&
      t.status !== "COMPLETED" &&
      t.status !== "CANCELLED" &&
      t.status !== "OVERDUE"
  ).length

  const effectiveOverdue = grouped.OVERDUE + pastDueCount
  const totalActive = grouped.TODO + grouped.IN_PROGRESS + grouped.IN_REVIEW + effectiveOverdue
  const totalTasks = tasks.length

  const displayStats = [
    { key: "TODO" as const, label: "To Do", count: grouped.TODO },
    { key: "IN_PROGRESS" as const, label: "In Progress", count: grouped.IN_PROGRESS },
    { key: "COMPLETED" as const, label: "Completed", count: grouped.COMPLETED },
    { key: "OVERDUE" as const, label: "Overdue", count: effectiveOverdue },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Tasks</CardTitle>
          <CardDescription>
            {totalActive} active of {totalTasks} total
          </CardDescription>
        </div>
        <ListTodo className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {totalTasks === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks created yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayStats.map((stat) => (
              <div key={stat.key} className="space-y-1">
                <p className="text-2xl font-bold">{stat.count}</p>
                <div className="flex items-center gap-1.5">
                  <Badge variant={TASK_STATUS_CONFIG[stat.key].variant} className="text-[10px] px-1.5 py-0">
                    {stat.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
