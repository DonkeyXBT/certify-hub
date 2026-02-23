"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { assignTraining } from "@/lib/actions/training"

interface Member {
  userId: string
  user: { id: string; name: string | null; email: string }
}

interface AssignUsersDialogProps {
  programId: string
  orgSlug: string
  members: Member[]
  alreadyAssigned: string[]
}

export function AssignUsersDialog({
  programId,
  orgSlug,
  members,
  alreadyAssigned,
}: AssignUsersDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const unassigned = members.filter(
    (m) => !alreadyAssigned.includes(m.user.id)
  )

  function toggleUser(userId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  function onSubmit() {
    if (selected.size === 0) return
    startTransition(async () => {
      const result = await assignTraining(
        programId,
        Array.from(selected),
        orgSlug
      )
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`${selected.size} user(s) assigned`)
        setOpen(false)
        setSelected(new Set())
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setSelected(new Set())
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Users</DialogTitle>
          <DialogDescription>
            Select team members to enroll in this training program.
          </DialogDescription>
        </DialogHeader>

        {unassigned.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            All team members are already assigned to this program.
          </p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto py-2">
            {unassigned.map((m) => (
              <div key={m.user.id} className="flex items-center gap-3">
                <Checkbox
                  id={`user-${m.user.id}`}
                  checked={selected.has(m.user.id)}
                  onCheckedChange={() => toggleUser(m.user.id)}
                />
                <Label
                  htmlFor={`user-${m.user.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <span className="font-medium">
                    {m.user.name ?? "Unnamed"}
                  </span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {m.user.email}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending || selected.size === 0}
          >
            {isPending
              ? "Assigning..."
              : `Assign ${selected.size > 0 ? `(${selected.size})` : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
