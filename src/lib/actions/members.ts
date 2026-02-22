"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { OrgRole } from "@prisma/client"

export async function inviteMember(orgId: string, email: string, role: OrgRole) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const existing = await db.invitation.findFirst({
    where: { orgId, email, status: "PENDING" },
  })
  if (existing) return { error: "Invitation already sent" }

  const existingMember = await db.membership.findFirst({
    where: { orgId, user: { email } },
  })
  if (existingMember) return { error: "User is already a member" }

  const invitation = await db.invitation.create({
    data: {
      orgId,
      email,
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  revalidatePath(`/org/[orgSlug]/settings/members`)
  return { id: invitation.id, token: invitation.token }
}

export async function updateMemberRole(membershipId: string, role: OrgRole) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.membership.update({
    where: { id: membershipId },
    data: { role },
  })

  revalidatePath(`/org/[orgSlug]/settings/members`)
  return { success: true }
}

export async function removeMember(membershipId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.membership.update({
    where: { id: membershipId },
    data: { isActive: false },
  })

  revalidatePath(`/org/[orgSlug]/settings/members`)
  return { success: true }
}

export async function acceptInvitation(token: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const invitation = await db.invitation.findUnique({ where: { token } })
  if (!invitation) return { error: "Invalid invitation" }
  if (invitation.status !== "PENDING") return { error: "Invitation is no longer valid" }
  if (invitation.expiresAt < new Date()) return { error: "Invitation has expired" }

  await db.membership.create({
    data: {
      userId: session.user.id,
      orgId: invitation.orgId,
      role: invitation.role,
    },
  })

  await db.invitation.update({
    where: { id: invitation.id },
    data: { status: "ACCEPTED" },
  })

  return { orgId: invitation.orgId }
}
