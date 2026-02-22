import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getRiskCategories } from "@/lib/queries/risks"
import { PageHeader } from "@/components/layout/page-header"
import { RiskForm } from "@/components/risks/risk-form"

export default async function NewRiskPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const categories = await getRiskCategories(org.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Risk"
        description="Identify and assess a new risk"
      />
      <RiskForm categories={categories} />
    </div>
  )
}
