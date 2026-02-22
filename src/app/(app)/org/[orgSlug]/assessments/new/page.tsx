import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getFrameworks } from "@/lib/queries/frameworks"
import { PageHeader } from "@/components/layout/page-header"
import { AssessmentForm } from "@/components/assessments/assessment-form"

export default async function NewAssessmentPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const frameworks = await getFrameworks()

  return (
    <div className="space-y-6">
      <PageHeader title="New Assessment" description="Create a compliance assessment" />
      <AssessmentForm orgId={org.id} orgSlug={orgSlug} frameworks={frameworks} />
    </div>
  )
}
