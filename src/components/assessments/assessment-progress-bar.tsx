import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface AssessmentProgressBarProps {
  totalControls: number
  assessedCount: number
  compliantCount: number
  partialCount: number
  nonCompliantCount: number
  status: string
  overallScore: number | null
}

export function AssessmentProgressBar({
  totalControls,
  assessedCount,
  compliantCount,
  partialCount,
  nonCompliantCount,
  status,
  overallScore,
}: AssessmentProgressBarProps) {
  const percentage =
    totalControls > 0 ? Math.round((assessedCount / totalControls) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {assessedCount} of {totalControls} controls assessed ({percentage}%)
        </span>
        <div className="flex items-center gap-2">
          {compliantCount > 0 && (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
            >
              {compliantCount} Compliant
            </Badge>
          )}
          {partialCount > 0 && (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
            >
              {partialCount} Partial
            </Badge>
          )}
          {nonCompliantCount > 0 && (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
            >
              {nonCompliantCount} Non-Compliant
            </Badge>
          )}
          {status === "COMPLETED" && overallScore !== null && (
            <Badge variant="default">Score: {Math.round(overallScore)}%</Badge>
          )}
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}
