import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, Palette } from "lucide-react"
import { GeneralSettingsForm } from "@/components/settings/general-settings-form"
import { BrandingForm } from "@/components/settings/branding-form"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const settings = (org.settings as Record<string, unknown>) || {}
  const primaryColor = (settings.primaryColor as string) || null
  const appName = (settings.appName as string) || null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your organization settings"
      />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Building2 className="mr-1.5 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="mr-1.5 h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-1.5 h-4 w-4" />
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-6">
          <GeneralSettingsForm
            orgId={org.id}
            orgSlug={orgSlug}
            name={org.name}
            industry={org.industry}
            size={org.size}
            createdAt={org.createdAt}
          />
        </TabsContent>

        <TabsContent value="branding" className="mt-4 space-y-6">
          <BrandingForm
            orgId={org.id}
            orgSlug={orgSlug}
            primaryColor={primaryColor}
            appName={appName}
            logoUrl={org.logo}
          />
        </TabsContent>

        <TabsContent value="members" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your organization members, roles, and invitations.
              </p>
              <Button asChild>
                <Link href={`/org/${orgSlug}/settings/members`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Members
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
