import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getAssessmentById } from "@/lib/queries/assessments"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssessmentEditor } from "@/components/assessments/assessment-editor"
import { AssessmentProgressBar } from "@/components/assessments/assessment-progress-bar"
import { CompleteAssessmentButton } from "@/components/assessments/complete-assessment-button"
import { ReopenAssessmentButton } from "@/components/assessments/reopen-assessment-button"
import { GapCharts } from "@/components/assessments/gap-charts"
import { flattenClauses } from "@/lib/utils/assessment-helpers"

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; assessmentId: string }>
}) {
  const { orgSlug, assessmentId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const assessment = await getAssessmentById(assessmentId)
  if (!assessment) notFound()

  const allControls = flattenClauses(assessment.framework?.clauses ?? [])
  const totalControls = allControls.length

  const assessedResponses = assessment.responses.filter(
    (r) => r.complianceStatus !== "NOT_ASSESSED"
  )
  const assessedCount = assessedResponses.length
  const compliantCount = assessedResponses.filter(
    (r) => r.complianceStatus === "COMPLIANT"
  ).length
  const partialCount = assessedResponses.filter(
    (r) => r.complianceStatus === "PARTIALLY_COMPLIANT"
  ).length
  const nonCompliantCount = assessedResponses.filter(
    (r) => r.complianceStatus === "NON_COMPLIANT"
  ).length

  const statusColors: Record<string, string> = {
    NOT_STARTED: "secondary",
    IN_PROGRESS: "default",
    COMPLETED: "outline",
    ARCHIVED: "destructive",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={assessment.name}
        description={`${assessment.framework.name} — ${assessment.status.replace(/_/g, " ")}`}
        actions={
          <div className="flex items-center gap-2">
            {assessment.status !== "COMPLETED" && (
              <CompleteAssessmentButton
                assessmentId={assessment.id}
                disabled={assessedCount === 0}
              />
            )}
            {assessment.status === "COMPLETED" && (
              <ReopenAssessmentButton assessmentId={assessment.id} />
            )}
            <Badge
              variant={
                (statusColors[assessment.status] as
                  | "default"
                  | "secondary"
                  | "outline"
                  | "destructive") ?? "secondary"
              }
            >
              {assessment.status.replace(/_/g, " ")}
            </Badge>
          </div>
        }
      />

      <AssessmentProgressBar
        totalControls={totalControls}
        assessedCount={assessedCount}
        compliantCount={compliantCount}
        partialCount={partialCount}
        nonCompliantCount={nonCompliantCount}
        status={assessment.status}
        overallScore={assessment.overallScore}
      />

      <Tabs
        defaultValue={
          assessment.status === "COMPLETED" ? "results" : "assessment"
        }
      >
        <TabsList>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="assessment" className="mt-4">
          <AssessmentEditor assessment={assessment} orgSlug={orgSlug} />
        </TabsContent>
        <TabsContent value="results" className="mt-4">
          <GapCharts assessment={assessment} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
