"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { revokeInvitation } from "@/lib/actions/members"

interface RevokeInviteButtonProps {
  invitationId: string
  orgId: string
  orgSlug: string
}

export function RevokeInviteButton({
  invitationId,
  orgId,
  orgSlug,
}: RevokeInviteButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleRevoke() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("orgId", orgId)
      fd.set("orgSlug", orgSlug)
      fd.set("invitationId", invitationId)
      const result = await revokeInvitation(fd) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Invitation revoked")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRevoke}
      disabled={isPending}
    >
      <X className="mr-1 h-3 w-3" />
      Revoke
    </Button>
  )
}
