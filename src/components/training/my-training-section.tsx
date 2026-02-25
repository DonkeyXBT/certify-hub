"use client"

import { useTransition, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { selfUpdateTraining } from "@/lib/actions/training"
import { Play, CheckCircle2, GraduationCap } from "lucide-react"
import Link from "next/link"

interface MyRecord {
  id: string
  status: string
  score: number | null
  startedAt: Date | null
  completedAt: Date | null
  program: {
    id: string
    title: string
    description: string | null
    isMandatory: boolean
    passingScore: number | null
  }
}

const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  OVERDUE: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  WAIVED: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
}

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
  WAIVED: "Waived",
}

function TrainingCard({ record, orgSlug }: { record: MyRecord; orgSlug: string }) {
  const [isPending, startTransition] = useTransition()
  const [scoreInput, setScoreInput] = useState("")
  const [showScoreInput, setShowScoreInput] = useState(false)

  const canStart = record.status === "NOT_STARTED" || record.status === "OVERDUE"
  const canComplete = record.status === "IN_PROGRESS" || record.status === "NOT_STARTED" || record.status === "OVERDUE"
  const isCompleted = record.status === "COMPLETED" || record.status === "WAIVED"

  function handleStart() {
    startTransition(async () => {
      const result = await selfUpdateTraining(record.id, "start", orgSlug)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Training started")
      }
    })
  }

  function handleComplete() {
    if (record.program.passingScore && !showScoreInput) {
      setShowScoreInput(true)
      return
    }

    const score = scoreInput ? parseInt(scoreInput) : undefined
    if (record.program.passingScore && (score === undefined || isNaN(score))) {
      toast.error("Please enter your score")
      return
    }

    startTransition(async () => {
      const result = await selfUpdateTraining(record.id, "complete", orgSlug, score)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Training marked as completed")
        setShowScoreInput(false)
        setScoreInput("")
      }
    })
  }

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/org/${orgSlug}/training/${record.program.id}`}
              className="font-medium text-sm hover:underline truncate"
            >
              {record.program.title}
            </Link>
            {record.program.isMandatory && (
              <Badge
                variant="outline"
                className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 shrink-0"
              >
                Mandatory
              </Badge>
            )}
          </div>
          {record.program.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {record.program.description}
            </p>
          )}
        </div>
        <Badge
          variant="outline"
          className={`text-xs shrink-0 ${STATUS_COLORS[record.status] ?? ""}`}
        >
          {STATUS_LABELS[record.status] ?? record.status}
        </Badge>
      </div>

      {record.score !== null && (
        <p className="text-xs text-muted-foreground">
          Score: <span className="font-medium text-foreground">{record.score}%</span>
          {record.program.passingScore && (
            <span className="ml-1">
              (passing: {record.program.passingScore}%)
            </span>
          )}
        </p>
      )}

      {!isCompleted && (
        <div className="flex items-center gap-2 flex-wrap">
          {canStart && record.status === "NOT_STARTED" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={handleStart}
              disabled={isPending}
            >
              <Play className="h-3.5 w-3.5" />
              Start Training
            </Button>
          )}
          {canComplete && (
            <div className="flex items-center gap-2">
              {showScoreInput && (
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Score (0–100)"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="h-8 w-32 text-sm"
                  disabled={isPending}
                />
              )}
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleComplete}
                disabled={isPending}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {showScoreInput ? "Submit" : "Mark Complete"}
              </Button>
              {showScoreInput && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowScoreInput(false); setScoreInput("") }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface MyTrainingSectionProps {
  records: MyRecord[]
  orgSlug: string
}

export function MyTrainingSection({ records, orgSlug }: MyTrainingSectionProps) {
  if (records.length === 0) return null

  const pending = records.filter((r) => r.status !== "COMPLETED" && r.status !== "WAIVED")
  const completed = records.filter((r) => r.status === "COMPLETED" || r.status === "WAIVED")

  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-5">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-base">My Training</h2>
        <span className="text-xs text-muted-foreground ml-1">
          {completed.length}/{records.length} completed
        </span>
      </div>

      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map((r) => (
            <TrainingCard key={r.id} record={r} orgSlug={orgSlug} />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Completed
          </p>
          {completed.map((r) => (
            <TrainingCard key={r.id} record={r} orgSlug={orgSlug} />
          ))}
        </div>
      )}
    </div>
  )
}
