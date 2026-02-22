import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getAssessmentById } from "@/lib/queries/assessments"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssessmentWizard } from "@/components/assessments/assessment-wizard"
import { GapCharts } from "@/components/assessments/gap-charts"

export default async function AssessmentDetailPage({ params }: { params: Promise<{ orgSlug: string; assessmentId: string }> }) {
  const { orgSlug, assessmentId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const assessment = await getAssessmentById(assessmentId)
  if (!assessment) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={assessment.name}
        description={`${assessment.framework.name} — ${assessment.status.replace(/_/g, " ")}`}
        actions={<Badge variant={assessment.status === "COMPLETED" ? "default" : "secondary"}>{assessment.status.replace(/_/g, " ")}</Badge>}
      />
      <Tabs defaultValue={assessment.status === "COMPLETED" ? "results" : "assessment"}>
        <TabsList>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="assessment" className="mt-4">
          <AssessmentWizard assessment={assessment} orgSlug={orgSlug} />
        </TabsContent>
        <TabsContent value="results" className="mt-4">
          <GapCharts assessment={assessment} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
