import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserOrganizations } from "@/lib/queries/organization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingForm } from "@/components/auth/onboarding-form"

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const orgs = await getUserOrganizations(session.user.id)
  if (orgs.length > 0) {
    redirect(`/org/${orgs[0].slug}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your organization</CardTitle>
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
