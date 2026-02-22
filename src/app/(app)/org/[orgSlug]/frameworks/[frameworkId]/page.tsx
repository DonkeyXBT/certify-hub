import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { BookOpen, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import {
  getFrameworkWithClauses,
  getFrameworkControls,
} from "@/lib/queries/frameworks"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClauseTree } from "@/components/frameworks/clause-tree"
import { ControlList } from "@/components/frameworks/control-list"

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

export default async function FrameworkDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; frameworkId: string }>
}) {
  const { orgSlug, frameworkId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const [framework, controls] = await Promise.all([
    getFrameworkWithClauses(frameworkId),
    getFrameworkControls(frameworkId),
  ])

  if (!framework) notFound()

  const clauseCount = framework.clauses.length
  const controlCount = controls.length

  return (
    <div className="space-y-6">
      <PageHeader
        title={framework.name}
        description={framework.description ?? undefined}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/frameworks`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Frameworks
            </Link>
          </Button>
        }
      />

      {/* Framework metadata */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant="outline"
          className={
            frameworkStatusColors[framework.status] ??
            "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }
        >
          {formatStatusLabel(framework.status)}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Version {framework.version}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {framework.code}
        </span>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>
            {clauseCount} {clauseCount === 1 ? "clause" : "clauses"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>
            {controlCount} {controlCount === 1 ? "control" : "controls"}
          </span>
        </div>
      </div>

      {/* Tabs for Clauses and Controls views */}
      <Tabs defaultValue="clauses">
        <TabsList>
          <TabsTrigger value="clauses">
            <BookOpen className="mr-1.5 h-4 w-4" />
            Clauses
          </TabsTrigger>
          <TabsTrigger value="controls">
            <Shield className="mr-1.5 h-4 w-4" />
            Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clauses" className="mt-4">
          <ClauseTree clauses={framework.clauses} />
        </TabsContent>

        <TabsContent value="controls" className="mt-4">
          <ControlList controls={controls} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
