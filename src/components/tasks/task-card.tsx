"use client"

import { useState, useTransition, useRef } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { PriorityBadge } from "@/components/shared/priority-badge"
import type { Priority } from "@/components/shared/priority-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Shield,
  AlertTriangle,
  Wrench,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlignLeft,
} from "lucide-react"
import { format } from "date-fns"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EditTaskDialog } from "./edit-task-dialog"
import { TaskDetailSheet } from "./task-detail-sheet"
import { deleteTask } from "@/lib/actions/tasks"
import type { KanbanTask } from "@/lib/queries/tasks"

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

interface TaskCardProps {
  task: KanbanTask
  orgSlug: string
  members: Member[]
  controls: ControlImpl[]
  risks: LinkOption[]
  capas: LinkOption[]
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onTaskDeleted?: (taskId: string) => void
}

export function TaskCard({
  task,
  orgSlug,
  members,
  controls,
  risks,
  capas,
  onDragStart,
  onTaskDeleted,
}: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const isDraggingRef = useRef(false)

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

  function handleDelete() {
    startDeleteTransition(async () => {
      const fd = new FormData()
      fd.set("taskId", task.id)
      fd.set("orgSlug", orgSlug)
      const result = (await deleteTask(fd)) as { error?: string }
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Task deleted")
        setDeleteOpen(false)
        onTaskDeleted?.(task.id)
      }
    })
  }

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => {
          isDraggingRef.current = true
          onDragStart(e, task.id)
        }}
        onDragEnd={() => {
          isDraggingRef.current = false
        }}
        onClick={() => {
          if (!isDraggingRef.current) setDetailOpen(true)
        }}
        className="cursor-pointer active:cursor-grabbing p-3 space-y-2 hover:shadow-md transition-shadow select-none"
      >
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-medium leading-tight flex-1">{task.title}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setEditOpen(true)
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description indicator */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex gap-1">
            <AlignLeft className="h-3 w-3 shrink-0 mt-0.5 opacity-60" />
            <span>{task.description}</span>
          </p>
        )}

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

      <TaskDetailSheet
        task={task}
        orgSlug={orgSlug}
        members={members}
        controls={controls}
        risks={risks}
        capas={capas}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onTaskDeleted={onTaskDeleted}
      />

      <EditTaskDialog
        task={task}
        orgSlug={orgSlug}
        members={members}
        controls={controls}
        risks={risks}
        capas={capas}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
        loading={isDeleting}
      />
    </>
  )
}
