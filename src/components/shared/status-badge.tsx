import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─── Color Mappings ─────────────────────────────────────────────────────────

type ColorMapping = Record<string, string>

const complianceStatusColors: ColorMapping = {
  NOT_ASSESSED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  NON_COMPLIANT: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  PARTIALLY_COMPLIANT: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLIANT: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
}

const riskLevelColors: ColorMapping = {
  LOW: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  CRITICAL: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
}

const taskStatusColors: ColorMapping = {
  TODO: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  IN_REVIEW: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  COMPLETED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
  OVERDUE: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
}

const documentStatusColors: ColorMapping = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  PENDING_APPROVAL: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  APPROVED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  SUPERSEDED: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  OBSOLETE: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
}

const auditStatusColors: ColorMapping = {
  PLANNED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  FIELDWORK_COMPLETE: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  REPORT_DRAFT: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  REPORT_FINAL: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  CLOSED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
}

const capaStatusColors: ColorMapping = {
  OPEN: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  ROOT_CAUSE_ANALYSIS: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  ACTION_PLANNED: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  ACTION_IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  VERIFICATION: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  CLOSED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  CLOSED_INEFFECTIVE: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
}

// ─── Pre-built Variant Mappings ─────────────────────────────────────────────

export const statusColorMaps = {
  compliance: complianceStatusColors,
  risk: riskLevelColors,
  task: taskStatusColors,
  document: documentStatusColors,
  audit: auditStatusColors,
  capa: capaStatusColors,
} as const

export type StatusVariant = keyof typeof statusColorMaps

// ─── Component ──────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  colorMap?: ColorMapping
  className?: string
}

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function StatusBadge({
  status,
  variant,
  colorMap,
  className,
}: StatusBadgeProps) {
  const colors = colorMap ?? (variant ? statusColorMaps[variant] : undefined)
  const colorClass = colors?.[status]

  return (
    <Badge
      variant="outline"
      className={cn(
        colorClass ?? "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
        className,
      )}
    >
      {formatStatusLabel(status)}
    </Badge>
  )
}
