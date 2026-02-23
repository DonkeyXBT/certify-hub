"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateTrainingRecord, removeTrainingRecord } from "@/lib/actions/training"

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "WAIVED", label: "Waived" },
] as const

const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  OVERDUE: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  WAIVED: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
}

export function StatusBadge({ status }: { status: string }) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
  return (
    <Badge variant="outline" className={STATUS_COLORS[status] ?? ""}>
      {label}
    </Badge>
  )
}

interface TrainingRecordActionsProps {
  recordId: string
  currentStatus: string
  orgSlug: string
}

export function TrainingRecordActions({
  recordId,
  currentStatus,
  orgSlug,
}: TrainingRecordActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateTrainingRecord(
        recordId,
        { status: newStatus },
        orgSlug
      )
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Status updated")
      }
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeTrainingRecord(recordId, orgSlug)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("User removed from program")
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentStatus}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[140px]" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        disabled={isPending}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
