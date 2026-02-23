"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { reopenAssessment } from "@/lib/actions/assessments"

interface ReopenAssessmentButtonProps {
  assessmentId: string
}

export function ReopenAssessmentButton({
  assessmentId,
}: ReopenAssessmentButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleReopen() {
    startTransition(async () => {
      const result = (await reopenAssessment(assessmentId)) as any
      if (result?.error) {
        toast.error(
          typeof result.error === "string"
            ? result.error
            : "Failed to reopen assessment"
        )
      } else {
        toast.success("Assessment reopened for editing")
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {isPending ? "Reopening..." : "Reopen"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reopen Assessment</AlertDialogTitle>
          <AlertDialogDescription>
            This will change the status back to &quot;In Progress&quot; so you
            can edit responses. The previous score will be preserved until you
            complete the assessment again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReopen}>
            Reopen Assessment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
