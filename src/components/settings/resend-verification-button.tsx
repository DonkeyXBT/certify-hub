"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import { resendVerificationEmail } from "@/lib/actions/members"

interface ResendVerificationButtonProps {
  email: string
  orgId: string
  orgSlug: string
}

export function ResendVerificationButton({ email, orgId, orgSlug }: ResendVerificationButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleResend() {
    const formData = new FormData()
    formData.set("email", email)
    formData.set("orgId", orgId)
    formData.set("orgSlug", orgSlug)

    startTransition(async () => {
      const result = await resendVerificationEmail(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Verification email resent")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleResend}
      disabled={isPending}
      className="h-6 px-2 text-xs"
    >
      <RotateCw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
      Resend
    </Button>
  )
}
