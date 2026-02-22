"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createOrganizationSchema } from "@/lib/validations/organization"
import { redirect } from "next/navigation"

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
