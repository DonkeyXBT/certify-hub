"use client"

import { useRef, useTransition } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
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
import { adminCreateOrg } from "@/lib/actions/admin"
import { useState } from "react"

export function CreateOrgDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await adminCreateOrg(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Organization created")
        setOpen(false)
        formRef.current?.reset()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="create-org-name">Name *</Label>
            <Input id="create-org-name" name="name" placeholder="Acme Corp" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-org-industry">Industry</Label>
            <Input id="create-org-industry" name="industry" placeholder="Technology" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-org-size">Size</Label>
            <Input id="create-org-size" name="size" placeholder="50–200" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
