import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getAssessmentById } from "@/lib/queries/assessments"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getTasksForKanbanByAssessment } from "@/lib/queries/tasks"
import { getMembers } from "@/lib/queries/members"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssessmentEditor } from "@/components/assessments/assessment-editor"
import { AssessmentProgressBar } from "@/components/assessments/assessment-progress-bar"
import { CompleteAssessmentButton } from "@/components/assessments/complete-assessment-button"
import { ReopenAssessmentButton } from "@/components/assessments/reopen-assessment-button"
import { DeleteAssessmentButton } from "@/components/assessments/delete-assessment-button"
import { GapCharts } from "@/components/assessments/gap-charts"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { flattenClauses } from "@/lib/utils/assessment-helpers"

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; assessmentId: string }>
}) {
  const { orgSlug, assessmentId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [assessment, org] = await Promise.all([
    getAssessmentById(assessmentId),
    getOrganizationBySlug(orgSlug),
  ])
  if (!assessment) notFound()
  if (!org) redirect("/onboarding")

  const [tasks, members, controlImpls, risks, capas] = await Promise.all([
    getTasksForKanbanByAssessment(org.id, assessmentId),
    getMembers(org.id),
    db.controlImplementation.findMany({
      where: { orgId: org.id },
      include: { control: { select: { number: true, title: true } } },
      orderBy: { control: { number: "asc" } },
    }),
    db.risk.findMany({
      where: { orgId: org.id, deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    db.cAPA.findMany({
      where: { orgId: org.id, deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ])

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
            <DeleteAssessmentButton assessmentId={assessment.id} />
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
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="assessment" className="mt-4">
          <AssessmentEditor assessment={assessment} orgSlug={orgSlug} />
        </TabsContent>
        <TabsContent value="results" className="mt-4">
          <GapCharts assessment={assessment} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-end">
              <CreateTaskDialog
                orgId={org.id}
                orgSlug={orgSlug}
                members={members}
                controls={controlImpls}
                risks={risks}
                capas={capas}
                assessmentId={assessment.id}
              />
            </div>
            <KanbanBoard
              initialTasks={tasks}
              orgSlug={orgSlug}
              currentUserId={session.user.id}
              members={members}
              controls={controlImpls}
              risks={risks}
              capas={capas}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
