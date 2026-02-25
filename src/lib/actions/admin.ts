"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { sendVerificationEmail } from "@/lib/email"
import { randomUUID } from "crypto"
import type { OrgRole } from "@prisma/client"

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isSuperAdmin: true },
  })
  if (!user?.isSuperAdmin) throw new Error("Unauthorized: super admin only")
  return session.user.id
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function ensureUniqueSlug(base: string) {
  let slug = base
  let n = 0
  while (true) {
    const existing = await db.organization.findUnique({ where: { slug }, select: { id: true } })
    if (!existing) return slug
    slug = `${base}-${++n}`
  }
}

// ─── Organizations ────────────────────────────────────────────────────────────

export async function adminCreateOrg(formData: FormData) {
  await requireSuperAdmin()

  const name = (formData.get("name") as string)?.trim()
  const industry = (formData.get("industry") as string)?.trim() || null
  const size = (formData.get("size") as string)?.trim() || null

  if (!name || name.length < 2) return { error: "Name must be at least 2 characters" }

  const slug = await ensureUniqueSlug(generateSlug(name))
  await db.organization.create({ data: { name, slug, industry, size } })

  revalidatePath("/admin")
  return { success: true }
}

export async function adminUpdateOrg(formData: FormData) {
  await requireSuperAdmin()

  const orgId = formData.get("orgId") as string
  const name = (formData.get("name") as string)?.trim()
  const industry = (formData.get("industry") as string)?.trim() || null
  const size = (formData.get("size") as string)?.trim() || null

  if (!name || name.length < 2) return { error: "Name must be at least 2 characters" }

  await db.organization.update({ where: { id: orgId }, data: { name, industry, size } })

  revalidatePath("/admin")
  return { success: true }
}

export async function adminDeleteOrg(orgId: string) {
  try {
    await requireSuperAdmin()
    await db.organization.update({ where: { id: orgId }, data: { deletedAt: new Date() } })
    revalidatePath("/admin")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete organization" }
  }
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function adminAddMemberToOrg(formData: FormData) {
  await requireSuperAdmin()

  const orgId = formData.get("orgId") as string
  const orgName = (formData.get("orgName") as string) ?? "the organization"
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const role = ((formData.get("role") as string) || "VIEWER") as OrgRole

  if (!email) return { error: "Email is required" }

  const org = await db.organization.findUnique({ where: { id: orgId }, select: { id: true } })
  if (!org) return { error: "Organization not found" }

  // Find or create user
  let user = await db.user.findUnique({ where: { email }, select: { id: true } })

  if (!user) {
    user = await db.user.create({ data: { email }, select: { id: true } })

    // Create verification token & send email
    const token = randomUUID()
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gcrtool.cyfenced.nl"
    await sendVerificationEmail({
      to: email,
      name: email,
      orgName,
      verifyUrl: `${appUrl}/verify/${token}`,
    })
  }

  // Upsert membership
  const existing = await db.membership.findUnique({
    where: { userId_orgId: { userId: user.id, orgId } },
  })

  if (existing) {
    if (existing.isActive) return { error: "User is already an active member" }
    await db.membership.update({ where: { id: existing.id }, data: { isActive: true, role } })
  } else {
    await db.membership.create({ data: { userId: user.id, orgId, role, isActive: true } })
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function adminRemoveMember(userId: string, orgId: string) {
  try {
    await requireSuperAdmin()
    await db.membership.updateMany({
      where: { userId, orgId },
      data: { isActive: false },
    })
    revalidatePath("/admin")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to remove member" }
  }
}

export async function adminUpdateMemberRole(userId: string, orgId: string, role: string) {
  try {
    await requireSuperAdmin()
    await db.membership.updateMany({
      where: { userId, orgId },
      data: { role: role as OrgRole },
    })
    revalidatePath("/admin")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update role" }
  }
}

// ─── Users / Super Admins ─────────────────────────────────────────────────────

export async function adminToggleSuperAdmin(userId: string, isSuperAdmin: boolean) {
  try {
    await requireSuperAdmin()
    await db.user.update({ where: { id: userId }, data: { isSuperAdmin } })
    revalidatePath("/admin")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update super admin status" }
  }
}

export async function adminCreateUser(formData: FormData) {
  await requireSuperAdmin()

  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const name = (formData.get("name") as string)?.trim() || null
  const isSuperAdmin = formData.get("isSuperAdmin") === "true"

  if (!email) return { error: "Email is required" }

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) return { error: "A user with this email already exists" }

  const user = await db.user.create({ data: { email, name, isSuperAdmin } })

  // Send verification so they can set a password
  const token = randomUUID()
  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gcrtool.cyfenced.nl"
  await sendVerificationEmail({
    to: email,
    name: name ?? email,
    orgName: "Certifi by Cyfenced",
    verifyUrl: `${appUrl}/verify/${token}`,
  })

  revalidatePath("/admin")
  return { success: true, userId: user.id }
}
