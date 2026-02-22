import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BookOpen } from "lucide-react"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getFrameworks } from "@/lib/queries/frameworks"
import { PageHeader } from "@/components/layout/page-header"
import { FrameworkCard } from "@/components/frameworks/framework-card"
import { EmptyState } from "@/components/shared/empty-state"

export default async function FrameworksPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const frameworks = await getFrameworks()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frameworks"
        description="Browse published compliance frameworks, standards, and their clauses."
      />

      {frameworks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No frameworks available"
          description="There are no published frameworks yet. Frameworks will appear here once they are published."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((framework) => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              orgSlug={orgSlug}
            />
          ))}
        </div>
      )}
    </div>
  )
}
