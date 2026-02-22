"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function initializeControls(orgId: string, frameworkId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const controls = await db.control.findMany({
    where: { clause: { frameworkId } },
  })

  const existing = await db.controlImplementation.findMany({
    where: { orgId },
    select: { controlId: true },
  })

  const existingIds = new Set(existing.map((e) => e.controlId))
  const toCreate = controls.filter((c) => !existingIds.has(c.id))

  if (toCreate.length > 0) {
    await db.controlImplementation.createMany({
      data: toCreate.map((c) => ({
        orgId,
        controlId: c.id,
        status: "NOT_IMPLEMENTED",
        effectiveness: "NOT_TESTED",
      })),
    })
  }

  revalidatePath(`/org/[orgSlug]/controls`)
  return { created: toCreate.length }
}

export async function updateControlImplementation(id: string, data: {
  status?: string
  effectiveness?: string
  description?: string
  frequency?: string
  automationLevel?: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.controlImplementation.update({
    where: { id },
    data: {
      status: data.status as any,
      effectiveness: data.effectiveness as any,
      description: data.description,
      frequency: data.frequency,
      automationLevel: data.automationLevel,
      implementedDate: data.status === "FULLY_IMPLEMENTED" ? new Date() : undefined,
    },
  })

  revalidatePath(`/org/[orgSlug]/controls`)
  return { success: true }
}
