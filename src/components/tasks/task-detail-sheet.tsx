"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Shield,
  AlertTriangle,
  Wrench,
  User,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  CircleDot,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { PriorityBadge } from "@/components/shared/priority-badge"
import type { Priority } from "@/components/shared/priority-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EditTaskDialog } from "./edit-task-dialog"
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

interface TaskDetailSheetProps {
  task: KanbanTask
  orgSlug: string
  members: Member[]
  controls: ControlImpl[]
  risks: LinkOption[]
  capas: LinkOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskDeleted?: (taskId: string) => void
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  TODO: {
    label: "To Do",
    icon: Circle,
    className:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: CircleDot,
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: RefreshCw,
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  OVERDUE: {
    label: "Overdue",
    icon: AlertCircle,
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: Circle,
    className:
      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  },
}

export function TaskDetailSheet({
  task,
  orgSlug,
  members,
  controls,
  risks,
  capas,
  open,
  onOpenChange,
  onTaskDeleted,
}: TaskDetailSheetProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "COMPLETED" &&
    task.status !== "CANCELLED"

  const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.TODO
  const StatusIcon = cfg.icon

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
        onOpenChange(false)
        onTaskDeleted?.(task.id)
      }
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col overflow-y-auto">
          <SheetHeader className="pb-0">
            <SheetTitle className="text-left leading-snug pr-6">
              {task.title}
            </SheetTitle>
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.className}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {cfg.label}
              </span>
              <PriorityBadge priority={task.priority as Priority} />
            </div>
          </SheetHeader>

          <div className="mt-5 space-y-5 flex-1">
            {/* Description */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </p>
              {task.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description provided.
                </p>
              )}
            </div>

            <Separator />

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Assignee
                </p>
                <div className="flex items-center gap-1.5 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">
                    {task.assignee?.name ??
                      task.assignee?.email ?? (
                        <span className="text-muted-foreground italic">
                          Unassigned
                        </span>
                      )}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Due date
                </p>
                <div
                  className={`flex items-center gap-1.5 text-sm ${
                    isOverdue ? "text-destructive font-medium" : ""
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {task.dueDate ? (
                      <>
                        {format(new Date(task.dueDate), "d MMM yyyy")}
                        {isOverdue && (
                          <span className="ml-1 text-xs font-normal">
                            (overdue)
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No due date
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Created by
                </p>
                <p className="text-sm truncate">
                  {task.creator?.name ?? (
                    <span className="text-muted-foreground italic">
                      Unknown
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Created
                </p>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{format(new Date(task.createdAt), "d MMM yyyy")}</span>
                </div>
              </div>

              {task.completedAt && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Completed
                  </p>
                  <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {format(new Date(task.completedAt), "d MMM yyyy")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Linked items */}
            {(task.controlImplementation || task.risk || task.capa) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Linked to
                  </p>
                  {task.controlImplementation && (
                    <div className="flex items-start gap-2 text-sm">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span>
                        <span className="font-medium">
                          {task.controlImplementation.control.number}
                        </span>
                        {" — "}
                        {task.controlImplementation.control.title}
                      </span>
                    </div>
                  )}
                  {task.risk && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>{task.risk.title}</span>
                    </div>
                  )}
                  {task.capa && (
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{task.capa.title}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
        title="Delete task"
        description={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
        loading={isDeleting}
      />
    </>
  )
}
