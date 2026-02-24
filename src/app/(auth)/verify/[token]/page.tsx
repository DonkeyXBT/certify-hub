import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VerifyForm } from "@/components/auth/verify-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Invalid link</CardTitle>
          <CardDescription>
            This verification link is invalid or has already been used.
            If you&apos;ve already verified your account, you can log in below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isExpired = verificationToken.expires < new Date()

  if (isExpired) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Link expired</CardTitle>
          <CardDescription>
            This verification link has expired. Please ask your administrator to resend the verification email.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Check if user is already verified
  const user = await db.user.findUnique({
    where: { email: verificationToken.identifier },
    select: { name: true, email: true, emailVerified: true },
  })

  if (!user) notFound()

  if (user.emailVerified) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Already verified</CardTitle>
          <CardDescription>
            Your account has already been verified. You can log in below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Set up your account</CardTitle>
        <CardDescription>
          Welcome, {user.name}! Set your password to activate your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyForm token={token} email={user.email} />
      </CardContent>
    </Card>
  )
}
