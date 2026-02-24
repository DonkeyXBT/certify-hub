"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { TaskCard } from "./task-card"
import { updateTaskStatus } from "@/lib/actions/tasks"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { KanbanTask } from "@/lib/queries/tasks"

const COLUMNS = [
  { id: "TODO" as const, label: "To Do", color: "border-gray-300 dark:border-gray-600" },
  { id: "IN_PROGRESS" as const, label: "In Progress", color: "border-blue-400 dark:border-blue-500" },
  { id: "IN_REVIEW" as const, label: "In Review", color: "border-purple-400 dark:border-purple-500" },
  { id: "COMPLETED" as const, label: "Done", color: "border-green-400 dark:border-green-500" },
] as const

type ColumnStatus = (typeof COLUMNS)[number]["id"]

interface Member {
  user: { id: string; name: string | null; email: string }
}

interface ControlImpl {
  id: string
  control: { number: string; title: string }
}

interface LinkOption {
  id: string
  title: string
}

interface KanbanBoardProps {
  initialTasks: KanbanTask[]
  orgSlug: string
  members: Member[]
  controls: ControlImpl[]
  risks: LinkOption[]
  capas: LinkOption[]
}

export function KanbanBoard({
  initialTasks,
  orgSlug,
  members,
  controls,
  risks,
  capas,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData("text/plain", taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent, columnId: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  function handleDragLeave() {
    setDragOverColumn(null)
  }

  function handleDrop(e: React.DragEvent, newStatus: ColumnStatus) {
    e.preventDefault()
    setDragOverColumn(null)

    const taskId = e.dataTransfer.getData("text/plain")
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    )

    startTransition(async () => {
      const fd = new FormData()
      fd.set("taskId", taskId)
      fd.set("status", newStatus)
      fd.set("orgSlug", orgSlug)
      const result = await updateTaskStatus(fd) as any
      if (result?.error) {
        toast.error(result.error)
        // Revert on error
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: task.status } : t
          )
        )
      }
    })
  }

  function handleTaskDeleted(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const boardTasks = tasks.filter(
    (t) => t.status !== "CANCELLED" && t.status !== "OVERDUE"
  )

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 min-w-[900px] pb-4">
        {COLUMNS.map((column) => {
          const columnTasks = boardTasks.filter((t) => t.status === column.id)
          const isDragOver = dragOverColumn === column.id

          return (
            <div
              key={column.id}
              className={`flex-1 min-w-[220px] rounded-lg border-t-4 ${column.color} bg-muted/30 p-3 transition-colors ${
                isDragOver ? "bg-muted/60 ring-2 ring-ring/20" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">{column.label}</h3>
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[100px]">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    orgSlug={orgSlug}
                    members={members}
                    controls={controls}
                    risks={risks}
                    capas={capas}
                    onDragStart={handleDragStart}
                    onTaskDeleted={handleTaskDeleted}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
