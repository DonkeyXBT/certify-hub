import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserOrganizations } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingForm } from "@/components/auth/onboarding-form"

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const params = await searchParams
  const isNewOrg = params.new === "1"

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isSuperAdmin: true },
  })

  const orgs = await getUserOrganizations(session.user.id)

  // Non-super-admins can never create orgs
  if (!user?.isSuperAdmin) {
    // If they have orgs, go to the first one
    if (orgs.length > 0) {
      redirect(`/org/${orgs[0].slug}`)
    }
    // No orgs and not super admin — show waiting message
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Waiting for access</CardTitle>
            <CardDescription>
              Your account has been created, but you haven&apos;t been invited to any workspace yet.
              Please ask your administrator to send you an invitation.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Super admin: redirect to existing org unless explicitly creating new
  if (!isNewOrg && orgs.length > 0) {
    redirect(`/org/${orgs[0].slug}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isNewOrg ? "Create a new organization" : "Create your organization"}
          </CardTitle>
          <CardDescription>
            Set up your organization to start managing compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  )
}
