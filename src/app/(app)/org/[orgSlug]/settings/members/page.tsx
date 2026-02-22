import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug, getUserMembership } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, UserPlus, Mail, ShieldAlert } from "lucide-react"
import { format } from "date-fns"
import { AddMemberForm } from "@/components/settings/add-member-form"
import { MemberRoleSelect, RemoveMemberButton } from "@/components/settings/member-actions"
import { RevokeInviteButton } from "@/components/settings/revoke-invite-button"

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  AUDITOR: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  MANAGER: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  VIEWER: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
}

const inviteStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  ACCEPTED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  EXPIRED: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
  REVOKED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
}

export default async function MembersPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const currentMembership = await getUserMembership(session.user.id, org.id)
  if (!currentMembership || !currentMembership.isActive) redirect("/onboarding")

  const isAdmin = currentMembership.role === "ADMIN"

  const [memberships, invitations] = await Promise.all([
    db.membership.findMany({
      where: { orgId: org.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.invitation.findMany({
      where: { orgId: org.id },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const pendingInvites = invitations.filter((i) => i.status === "PENDING")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Manage team members and invitations"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/settings`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Link>
          </Button>
        }
      />

      {/* Current members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Team Members ({memberships.filter((m) => m.isActive).length})
          </CardTitle>
          <CardDescription>
            People who have access to this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                {isAdmin && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships
                .filter((m) => m.isActive)
                .map((membership) => {
                  const isSelf = membership.user.id === session.user.id
                  return (
                    <TableRow key={membership.id}>
                      <TableCell className="font-medium">
                        {membership.user.name ?? "—"}
                        {isSelf && (
                          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                        )}
                      </TableCell>
                      <TableCell>{membership.user.email}</TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <MemberRoleSelect
                            membershipId={membership.id}
                            orgId={org.id}
                            orgSlug={orgSlug}
                            currentRole={membership.role}
                            isSelf={isSelf}
                          />
                        ) : (
                          <Badge
                            variant="outline"
                            className={roleColors[membership.role]}
                          >
                            {membership.role}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(membership.createdAt, "MMM d, yyyy")}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <RemoveMemberButton
                            membershipId={membership.id}
                            orgId={org.id}
                            orgSlug={orgSlug}
                            memberName={membership.user.name ?? membership.user.email}
                            isSelf={isSelf}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Invitations ({pendingInvites.length} pending)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Sent</TableHead>
                  {isAdmin && <TableHead className="w-[80px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">
                      {invite.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={roleColors[invite.role]}
                      >
                        {invite.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={inviteStatusColors[invite.status]}
                      >
                        {invite.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(invite.expiresAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(invite.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        {invite.status === "PENDING" && (
                          <RevokeInviteButton
                            invitationId={invite.id}
                            orgId={org.id}
                            orgSlug={orgSlug}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add member / Invite form — admin only */}
      {isAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Member
              </div>
            </CardTitle>
            <CardDescription>
              Add an existing user to this organization by their email address.
              They must have already registered an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddMemberForm orgId={org.id} orgSlug={orgSlug} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldAlert className="h-5 w-5" />
              <span>Only administrators can add or remove members.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
