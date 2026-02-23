"use client"

import { Card } from "@/components/ui/card"
import { PriorityBadge } from "@/components/shared/priority-badge"
import type { Priority } from "@/components/shared/priority-badge"
import { Badge } from "@/components/ui/badge"
import { Calendar, Shield, AlertTriangle, Wrench, User } from "lucide-react"
import { format } from "date-fns"
import type { KanbanTask } from "@/lib/queries/tasks"

interface TaskCardProps {
  task: KanbanTask
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const linkedLabel = task.controlImplementation
    ? task.controlImplementation.control.number
    : task.risk
      ? task.risk.title
      : task.capa
        ? task.capa.title
        : null

  const linkedIcon = task.controlImplementation
    ? Shield
    : task.risk
      ? AlertTriangle
      : task.capa
        ? Wrench
        : null

  const LinkedIcon = linkedIcon

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "COMPLETED" &&
    task.status !== "CANCELLED"

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="cursor-grab active:cursor-grabbing p-3 space-y-2 hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-medium leading-tight">{task.title}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority as Priority} />

        {linkedLabel && LinkedIcon && (
          <Badge variant="secondary" className="text-xs gap-1 font-normal">
            <LinkedIcon className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{linkedLabel}</span>
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span className="truncate max-w-[80px]">
            {task.assignee?.name ?? task.assignee?.email ?? "Unassigned"}
          </span>
        </div>

        {task.dueDate && (
          <div
            className={`flex items-center gap-1 ${
              isOverdue ? "text-destructive font-medium" : ""
            }`}
          >
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
