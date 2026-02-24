import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getUserMembership, getUserOrganizations } from "@/lib/queries/organization"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { OrgBrandStyles } from "@/components/layout/org-brand-styles"

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) notFound()

  const membership = await getUserMembership(session.user.id, org.id)
  if (!membership || !membership.isActive) {
    redirect("/onboarding")
  }

  const userOrgs = await getUserOrganizations(session.user.id)

  const settings = (org.settings as Record<string, unknown>) || {}
  const primaryColor = (settings.primaryColor as string) || null
  const appName = (settings.appName as string) || null

  return (
    <SidebarProvider>
      <OrgBrandStyles primaryColor={primaryColor} />
      <AppSidebar
        org={{
          id: org.id,
          name: appName || org.name,
          slug: org.slug,
          logo: org.logo,
        }}
        userOrgs={userOrgs}
        userRole={membership.role}
        user={{
          name: session.user.name ?? undefined,
          email: session.user.email ?? undefined,
          image: session.user.image ?? undefined,
        }}
      />
      <SidebarInset>
        <AppHeader orgSlug={org.slug} />
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
