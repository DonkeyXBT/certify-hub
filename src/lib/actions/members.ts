"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { OrgRole } from "@prisma/client"

async function requireAdmin(orgId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const membership = await db.membership.findUnique({
    where: { userId_orgId: { userId: session.user.id, orgId } },
  })

  if (!membership || membership.role !== "ADMIN" || !membership.isActive) {
    throw new Error("Only admins can manage members")
  }

  return session.user.id
}

export async function addUserToOrg(formData: FormData) {
  const orgId = formData.get("orgId") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as OrgRole
  const orgSlug = formData.get("orgSlug") as string

  if (!orgId || !email || !role) {
    return { error: "All fields are required" }
  }

  await requireAdmin(orgId)

  // Find the user by email
  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return { error: `No user found with email "${email}". They must register first.` }
  }

  // Check if already a member
  const existing = await db.membership.findUnique({
    where: { userId_orgId: { userId: user.id, orgId } },
  })

  if (existing) {
    if (existing.isActive) {
      return { error: "User is already an active member of this organization" }
    }
    // Re-activate if previously removed
    await db.membership.update({
      where: { id: existing.id },
      data: { isActive: true, role },
    })
    revalidatePath(`/org/${orgSlug}/settings/members`)
    return { success: true }
  }

  await db.membership.create({
    data: {
      userId: user.id,
      orgId,
      role,
      isActive: true,
    },
  })

  revalidatePath(`/org/${orgSlug}/settings/members`)
  return { success: true }
}

export async function inviteMember(formData: FormData) {
  const orgId = formData.get("orgId") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as OrgRole
  const orgSlug = formData.get("orgSlug") as string

  if (!orgId || !email || !role) {
    return { error: "All fields are required" }
  }

  await requireAdmin(orgId)

  const existingMember = await db.membership.findFirst({
    where: { orgId, user: { email }, isActive: true },
  })
  if (existingMember) return { error: "User is already a member" }

  const existingInvite = await db.invitation.findFirst({
    where: { orgId, email, status: "PENDING" },
  })
  if (existingInvite) return { error: "Invitation already pending for this email" }

  const invitation = await db.invitation.create({
    data: {
      orgId,
      email,
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  revalidatePath(`/org/${orgSlug}/settings/members`)
  return { success: true, token: invitation.token }
}

export async function updateMemberRole(formData: FormData) {
  const orgId = formData.get("orgId") as string
  const membershipId = formData.get("membershipId") as string
  const role = formData.get("role") as OrgRole
  const orgSlug = formData.get("orgSlug") as string

  if (!orgId || !membershipId || !role) {
    return { error: "All fields are required" }
  }

  const currentUserId = await requireAdmin(orgId)

  // Prevent admin from changing their own role
  const target = await db.membership.findUnique({
    where: { id: membershipId },
  })
  if (!target || target.orgId !== orgId) {
    return { error: "Member not found in this organization" }
  }
  if (target.userId === currentUserId) {
    return { error: "You cannot change your own role" }
  }

  await db.membership.update({
    where: { id: membershipId },
    data: { role },
  })

  revalidatePath(`/org/${orgSlug}/settings/members`)
  return { success: true }
}

export async function removeMember(formData: FormData) {
  const orgId = formData.get("orgId") as string
  const membershipId = formData.get("membershipId") as string
  const orgSlug = formData.get("orgSlug") as string

  if (!orgId || !membershipId) {
    return { error: "Missing required fields" }
  }

  const currentUserId = await requireAdmin(orgId)

  const target = await db.membership.findUnique({
    where: { id: membershipId },
  })
  if (!target || target.orgId !== orgId) {
    return { error: "Member not found in this organization" }
  }
  if (target.userId === currentUserId) {
    return { error: "You cannot remove yourself" }
  }

  await db.membership.update({
    where: { id: membershipId },
    data: { isActive: false },
  })

  revalidatePath(`/org/${orgSlug}/settings/members`)
  return { success: true }
}

export async function revokeInvitation(formData: FormData) {
  const orgId = formData.get("orgId") as string
  const invitationId = formData.get("invitationId") as string
  const orgSlug = formData.get("orgSlug") as string

  if (!orgId || !invitationId) {
    return { error: "Missing required fields" }
  }

  await requireAdmin(orgId)

  const invitation = await db.invitation.findUnique({
    where: { id: invitationId },
  })
  if (!invitation || invitation.orgId !== orgId) {
    return { error: "Invitation not found" }
  }
  if (invitation.status !== "PENDING") {
    return { error: "Invitation is not pending" }
  }

  await db.invitation.update({
    where: { id: invitationId },
    data: { status: "REVOKED" },
  })

  revalidatePath(`/org/${orgSlug}/settings/members`)
  return { success: true }
}

export async function acceptInvitation(token: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const invitation = await db.invitation.findUnique({ where: { token } })
  if (!invitation) return { error: "Invalid invitation" }
  if (invitation.status !== "PENDING") return { error: "Invitation is no longer valid" }
  if (invitation.expiresAt < new Date()) return { error: "Invitation has expired" }

  // Check if the user's email matches the invitation
  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.email !== invitation.email) {
    return { error: "This invitation was sent to a different email address" }
  }

  await db.membership.create({
    data: {
      userId: session.user.id,
      orgId: invitation.orgId,
      role: invitation.role,
      isActive: true,
    },
  })

  await db.invitation.update({
    where: { id: invitation.id },
    data: { status: "ACCEPTED" },
  })

  const org = await db.organization.findUnique({
    where: { id: invitation.orgId },
    select: { slug: true },
  })

  return { success: true, orgSlug: org?.slug }
}
