"use client"

import { useRef, useTransition, useState } from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { adminCreateUser } from "@/lib/actions/admin"

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("isSuperAdmin", String(isSuperAdmin))
    startTransition(async () => {
      const result = await adminCreateUser(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("User created and verification email sent")
        setOpen(false)
        formRef.current?.reset()
        setIsSuperAdmin(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="h-4 w-4" />
          New User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="create-user-email">Email *</Label>
            <Input
              id="create-user-email"
              name="email"
              type="email"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-user-name">Name</Label>
            <Input
              id="create-user-name"
              name="name"
              placeholder="Jane Smith"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Super Admin</p>
              <p className="text-xs text-muted-foreground">
                Full platform access including this admin panel
              </p>
            </div>
            <Switch
              checked={isSuperAdmin}
              onCheckedChange={setIsSuperAdmin}
              aria-label="Super admin"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            A verification email will be sent so the user can set their password.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
