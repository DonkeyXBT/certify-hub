"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import type { OrgRole } from "@prisma/client"
import { sendVerificationEmail } from "@/lib/email"
import { randomUUID } from "crypto"

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
    return { error: `No user found with email "${email}". Use "Create New Account" to create one.` }
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

export async function createUserAndAddToOrg(formData: FormData) {
  const orgId = formData.get("orgId") as string
  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as OrgRole
  const orgSlug = formData.get("orgSlug") as string

  if (!orgId || !email || !name || !role) {
    return { error: "All fields are required" }
  }

  await requireAdmin(orgId)

  // Check if email already exists
  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    return { error: `A user with email "${email}" already exists. Use "Add Existing Member" instead.` }
  }

  // Create user without password — they'll set it during verification
  const user = await db.user.create({
    data: {
      name,
      email,
    },
  })

  await db.membership.create({
    data: {
      userId: user.id,
      orgId,
      role,
      isActive: true,
    },
  })

  // Create a verification token (7-day expiry)
  const token = randomUUID()
  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  // Get org name for the email
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { name: true },
  })

  // Send verification email
  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
  const verifyUrl = `${baseUrl}/verify/${token}`

  await sendVerificationEmail({
    to: email,
    name,
    orgName: org?.name ?? "your organization",
    verifyUrl,
  })

  revalidatePath(`/org/${orgSlug}/settings/members`)
  return { success: true }
}

export async function verifyEmailAndSetPassword(formData: FormData) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string

  if (!token || !password) {
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return { error: "Invalid or expired verification link" }
  }

  if (verificationToken.expires < new Date()) {
    // Clean up expired token
    await db.verificationToken.delete({ where: { token } })
    return { error: "This verification link has expired. Please contact your administrator." }
  }

  const user = await db.user.findUnique({
    where: { email: verificationToken.identifier },
  })

  if (!user) {
    return { error: "User not found" }
  }

  if (user.emailVerified) {
    // Already verified — clean up token
    await db.verificationToken.delete({ where: { token } })
    return { error: "This account has already been verified. Please log in." }
  }

  const hashedPassword = await hash(password, 12)

  await db.user.update({
    where: { id: user.id },
    data: {
      hashedPassword,
      emailVerified: new Date(),
    },
  })

  // Clean up the used token
  await db.verificationToken.delete({ where: { token } })

  return { success: true }
}

export async function resendVerificationEmail(formData: FormData) {
  const orgId = formData.get("orgId") as string
  const email = formData.get("email") as string
  const orgSlug = formData.get("orgSlug") as string

  if (!orgId || !email) {
    return { error: "Missing required fields" }
  }

  await requireAdmin(orgId)

  const user = await db.user.findUnique({ where: { email } })
  if (!user) return { error: "User not found" }
  if (user.emailVerified) return { error: "User is already verified" }

  // Delete any existing tokens for this user
  await db.verificationToken.deleteMany({
    where: { identifier: email },
  })

  // Create a new verification token
  const token = randomUUID()
  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { name: true },
  })

  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
  const verifyUrl = `${baseUrl}/verify/${token}`

  await sendVerificationEmail({
    to: email,
    name: user.name ?? "there",
    orgName: org?.name ?? "your organization",
    verifyUrl,
  })

  revalidatePath(`/org/${orgSlug}/settings/members`)
  return { success: true }
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
