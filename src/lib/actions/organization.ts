"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createOrganizationSchema } from "@/lib/validations/organization"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 0

  while (true) {
    const existing = await db.organization.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing) return slug

    counter++
    slug = `${baseSlug}-${counter}`
  }
}

export async function createOrganization(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Only super admins can create organizations
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isSuperAdmin: true },
  })
  if (!user?.isSuperAdmin) {
    return { error: "Only super admins can create organizations" }
  }

  const rawData = {
    name: formData.get("name") as string,
    industry: formData.get("industry") as string,
    size: formData.get("size") as string,
  }

  const validated = createOrganizationSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    }
  }

  const { name, industry, size } = validated.data
  const baseSlug = generateSlug(name)
  const slug = await ensureUniqueSlug(baseSlug)

  const org = await db.organization.create({
    data: {
      name,
      slug,
      industry,
      size,
      memberships: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
          isActive: true,
        },
      },
    },
  })

  redirect(`/org/${org.slug}`)
}

export async function updateOrganization(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const orgSlug = formData.get("orgSlug") as string
  const name = (formData.get("name") as string)?.trim()
  const industry = (formData.get("industry") as string)?.trim() || null
  const size = (formData.get("size") as string)?.trim() || null

  if (!name || name.length < 2) return { error: "Name must be at least 2 characters" }

  await db.organization.update({
    where: { id: orgId },
    data: { name, industry, size },
  })

  revalidatePath(`/org/${orgSlug}/settings`)
  return { success: true }
}

export async function updateBranding(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const orgSlug = formData.get("orgSlug") as string
  const primaryColor = (formData.get("primaryColor") as string)?.trim() || null
  const appName = (formData.get("appName") as string)?.trim() || null
  const logoUrl = (formData.get("logoUrl") as string)?.trim() || null

  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { settings: true },
  })

  const currentSettings = (org?.settings as Record<string, unknown>) || {}

  await db.organization.update({
    where: { id: orgId },
    data: {
      logo: logoUrl,
      settings: {
        ...currentSettings,
        primaryColor,
        appName,
      },
    },
  })

  revalidatePath(`/org/${orgSlug}`)
  return { success: true }
}
