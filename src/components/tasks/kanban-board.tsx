"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { TaskCard } from "./task-card"
import { TaskFiltersBar, DEFAULT_FILTERS } from "./task-filters"
import type { TaskFilters } from "./task-filters"
import { updateTaskStatus } from "@/lib/actions/tasks"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { KanbanTask } from "@/lib/queries/tasks"

const COLUMNS = [
  { id: "TODO" as const,        label: "To Do",      color: "border-gray-300 dark:border-gray-600" },
  { id: "IN_PROGRESS" as const, label: "In Progress", color: "border-blue-400 dark:border-blue-500" },
  { id: "IN_REVIEW" as const,   label: "In Review",  color: "border-purple-400 dark:border-purple-500" },
  { id: "COMPLETED" as const,   label: "Done",       color: "border-green-400 dark:border-green-500" },
  { id: "OVERDUE" as const,     label: "Overdue",    color: "border-red-400 dark:border-red-500" },
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
  currentUserId: string
  members: Member[]
  controls: ControlImpl[]
  risks: LinkOption[]
  capas: LinkOption[]
}

function applyFilters(tasks: KanbanTask[], filters: TaskFilters): KanbanTask[] {
  return tasks.filter((task) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (
        !task.title.toLowerCase().includes(q) &&
        !(task.description ?? "").toLowerCase().includes(q)
      )
        return false
    }
    if (filters.priority !== "all" && task.priority !== filters.priority)
      return false
    if (filters.assigneeId === "unassigned" && task.assignee !== null)
      return false
    if (
      filters.assigneeId !== "all" &&
      filters.assigneeId !== "unassigned" &&
      task.assignee?.id !== filters.assigneeId
    )
      return false
    return true
  })
}

export function KanbanBoard({
  initialTasks,
  orgSlug,
  currentUserId,
  members,
  controls,
  risks,
  capas,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [, startTransition] = useTransition()

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
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )

    startTransition(async () => {
      const fd = new FormData()
      fd.set("taskId", taskId)
      fd.set("status", newStatus)
      fd.set("orgSlug", orgSlug)
      const result = (await updateTaskStatus(fd)) as { error?: string }
      if (result?.error) {
        toast.error(result.error)
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
        )
      }
    })
  }

  function handleTaskDeleted(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  // Exclude only CANCELLED tasks from the board
  const activeTasks = tasks.filter((t) => t.status !== "CANCELLED")
  const filteredTasks = applyFilters(activeTasks, filters)

  const hasActiveFilters =
    filters.search !== "" ||
    filters.assigneeId !== "all" ||
    filters.priority !== "all"

  return (
    <div className="space-y-3">
      <TaskFiltersBar
        filters={filters}
        onChange={setFilters}
        members={members}
        currentUserId={currentUserId}
        totalCount={activeTasks.length}
        filteredCount={filteredTasks.length}
      />

      <ScrollArea className="w-full">
        <div className="flex gap-4 min-w-[1100px] pb-4">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === column.id
            )
            const isDragOver = dragOverColumn === column.id

            return (
              <div
                key={column.id}
                className={`flex-1 min-w-[200px] rounded-lg border-t-4 ${column.color} bg-muted/30 p-3 transition-colors ${
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

                  {columnTasks.length === 0 && hasActiveFilters && (
                    <p className="text-xs text-muted-foreground/50 text-center pt-4">
                      No matches
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
