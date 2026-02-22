"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus } from "lucide-react"
import { addUserToOrg } from "@/lib/actions/members"

interface AddMemberFormProps {
  orgId: string
  orgSlug: string
}

export function AddMemberForm({ orgId, orgSlug }: AddMemberFormProps) {
  const [isPending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await addUserToOrg(formData) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Member added successfully")
        // Reset the form
        const form = document.getElementById("add-member-form") as HTMLFormElement
        form?.reset()
      }
    })
  }

  return (
    <form id="add-member-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="orgId" value={orgId} />
      <input type="hidden" name="orgSlug" value={orgSlug} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="add-email">Email Address</Label>
          <Input
            id="add-email"
            name="email"
            type="email"
            placeholder="user@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="add-role">Role</Label>
          <Select name="role" defaultValue="VIEWER">
            <SelectTrigger id="add-role" className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Administrator</SelectItem>
              <SelectItem value="AUDITOR">Auditor</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="VIEWER">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        <UserPlus className="mr-2 h-4 w-4" />
        {isPending ? "Adding..." : "Add Member"}
      </Button>
    </form>
  )
}
