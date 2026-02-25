"use client"

import { useRef, useTransition, useState } from "react"
import { toast } from "sonner"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminUpdateOrg } from "@/lib/actions/admin"

interface EditOrgDialogProps {
  orgId: string
  name: string
  industry: string | null
  size: string | null
}

export function EditOrgDialog({ orgId, name, industry, size }: EditOrgDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("orgId", orgId)
    startTransition(async () => {
      const result = await adminUpdateOrg(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Organization updated")
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-foreground">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`edit-org-name-${orgId}`}>Name *</Label>
            <Input
              id={`edit-org-name-${orgId}`}
              name="name"
              defaultValue={name}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-org-industry-${orgId}`}>Industry</Label>
            <Input
              id={`edit-org-industry-${orgId}`}
              name="industry"
              defaultValue={industry ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-org-size-${orgId}`}>Size</Label>
            <Input
              id={`edit-org-size-${orgId}`}
              name="size"
              defaultValue={size ?? ""}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
