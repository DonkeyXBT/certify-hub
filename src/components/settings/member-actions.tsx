"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UserMinus } from "lucide-react"
import { updateMemberRole, removeMember } from "@/lib/actions/members"

interface MemberRoleSelectProps {
  membershipId: string
  orgId: string
  orgSlug: string
  currentRole: string
  isSelf: boolean
}

export function MemberRoleSelect({
  membershipId,
  orgId,
  orgSlug,
  currentRole,
  isSelf,
}: MemberRoleSelectProps) {
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(newRole: string) {
    if (newRole === currentRole) return

    startTransition(async () => {
      const fd = new FormData()
      fd.set("orgId", orgId)
      fd.set("orgSlug", orgSlug)
      fd.set("membershipId", membershipId)
      fd.set("role", newRole)
      const result = await updateMemberRole(fd) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Role updated")
      }
    })
  }

  return (
    <Select
      defaultValue={currentRole}
      onValueChange={handleRoleChange}
      disabled={isPending || isSelf}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="AUDITOR">Auditor</SelectItem>
        <SelectItem value="MANAGER">Manager</SelectItem>
        <SelectItem value="VIEWER">Viewer</SelectItem>
      </SelectContent>
    </Select>
  )
}

interface RemoveMemberButtonProps {
  membershipId: string
  orgId: string
  orgSlug: string
  memberName: string
  isSelf: boolean
}

export function RemoveMemberButton({
  membershipId,
  orgId,
  orgSlug,
  memberName,
  isSelf,
}: RemoveMemberButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleRemove() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("orgId", orgId)
      fd.set("orgSlug", orgSlug)
      fd.set("membershipId", membershipId)
      const result = await removeMember(fd) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Member removed")
      }
    })
  }

  if (isSelf) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <UserMinus className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {memberName} from this organization?
            They will lose access to all organization resources.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
