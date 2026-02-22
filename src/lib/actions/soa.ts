"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function initializeSoA(orgId: string, frameworkId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const controls = await db.control.findMany({
    where: { clause: { frameworkId } },
  })

  const existing = await db.soAEntry.findMany({
    where: { orgId, frameworkId },
    select: { controlId: true },
  })

  const existingIds = new Set(existing.map((e) => e.controlId))
  const toCreate = controls.filter((c) => !existingIds.has(c.id))

  if (toCreate.length > 0) {
    await db.soAEntry.createMany({
      data: toCreate.map((c) => ({
        orgId,
        frameworkId,
        controlId: c.id,
        applicability: "APPLICABLE",
        implStatus: "NOT_IMPLEMENTED",
      })),
    })
  }

  revalidatePath(`/org/[orgSlug]/soa`)
  return { created: toCreate.length }
}

export async function updateSoAEntry(
  entryId: string,
  data: { applicability?: string; justification?: string; implStatus?: string }
) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.soAEntry.update({
    where: { id: entryId },
    data: {
      applicability: data.applicability as any,
      justification: data.justification,
      implStatus: data.implStatus as any,
    },
  })

  revalidatePath(`/org/[orgSlug]/soa`)
  return { success: true }
}
