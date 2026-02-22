import Link from "next/link"
import { BookOpen, Shield } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FrameworkListItem } from "@/lib/queries/frameworks"

interface FrameworkCardProps {
  framework: FrameworkListItem
  orgSlug: string
}

const frameworkStatusColors: Record<string, string> = {
  DRAFT:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  PUBLISHED:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  DEPRECATED:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
}

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function FrameworkCard({ framework, orgSlug }: FrameworkCardProps) {
  return (
    <Link
      href={`/org/${orgSlug}/frameworks/${framework.id}`}
      className="block transition-shadow hover:shadow-md rounded-xl"
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{framework.name}</CardTitle>
            <Badge
              variant="outline"
              className={
                frameworkStatusColors[framework.status] ??
                "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }
            >
              {formatStatusLabel(framework.status)}
            </Badge>
          </div>
          <CardDescription>
            Version {framework.version}
            {framework.code && (
              <span className="ml-2 font-mono text-xs text-muted-foreground/70">
                {framework.code}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {framework.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {framework.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>
                {framework.clauseCount}{" "}
                {framework.clauseCount === 1 ? "clause" : "clauses"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              <span>
                {framework.controlCount}{" "}
                {framework.controlCount === 1 ? "control" : "controls"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
