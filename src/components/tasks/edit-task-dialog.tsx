"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateTask } from "@/lib/actions/tasks"
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

interface EditTaskDialogProps {
  task: KanbanTask
  orgSlug: string
  members: Member[]
  controls: ControlImpl[]
  risks: LinkOption[]
  capas: LinkOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({
  task,
  orgSlug,
  members,
  controls,
  risks,
  capas,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const [isPending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = (await updateTask(formData)) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Task updated")
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details and linked items.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4">
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="orgSlug" value={orgSlug} />

          <div className="space-y-2">
            <Label htmlFor="edit-task-title">Title *</Label>
            <Input
              id="edit-task-title"
              name="title"
              defaultValue={task.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-task-description">Description</Label>
            <Textarea
              id="edit-task-description"
              name="description"
              defaultValue={task.description ?? ""}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select name="priority" defaultValue={task.priority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                name="assigneeId"
                defaultValue={task.assignee?.id ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.user.id} value={m.user.id}>
                      {m.user.name ?? m.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-task-due">Due Date</Label>
            <Input
              id="edit-task-due"
              name="dueDate"
              type="date"
              defaultValue={
                task.dueDate
                  ? new Date(task.dueDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Link to Control</Label>
            <Select
              name="controlImplementationId"
              defaultValue={task.controlImplementation?.id ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {controls.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.control.number} — {c.control.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {risks.length > 0 && (
            <div className="space-y-2">
              <Label>Link to Risk</Label>
              <Select
                name="riskId"
                defaultValue={task.risk?.id ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {risks.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {capas.length > 0 && (
            <div className="space-y-2">
              <Label>Link to CAPA</Label>
              <Select
                name="capaId"
                defaultValue={task.capa?.id ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {capas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
