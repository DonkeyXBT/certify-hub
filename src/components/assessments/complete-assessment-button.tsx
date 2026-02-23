"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Check } from "lucide-react"
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
import { completeAssessment } from "@/lib/actions/assessments"

interface CompleteAssessmentButtonProps {
  assessmentId: string
  disabled?: boolean
}

export function CompleteAssessmentButton({
  assessmentId,
  disabled,
}: CompleteAssessmentButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleComplete() {
    startTransition(async () => {
      const result = (await completeAssessment(assessmentId)) as any
      if (result?.error) {
        toast.error(
          typeof result.error === "string"
            ? result.error
            : "Failed to complete assessment"
        )
      } else {
        toast.success(
          `Assessment completed! Score: ${result?.overallScore ?? 0}%`
        )
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" disabled={disabled || isPending}>
          <Check className="mr-2 h-4 w-4" />
          {isPending ? "Completing..." : "Complete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Assessment</AlertDialogTitle>
          <AlertDialogDescription>
            This will calculate your compliance score and mark the assessment as
            completed. You can reopen it later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleComplete}>
            Complete Assessment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
