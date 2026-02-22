"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createEvidence(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const type = formData.get("type") as string
  const controlImplementationId = formData.get("controlImplementationId") as string
  const fileUrl = formData.get("fileUrl") as string
  const fileName = formData.get("fileName") as string
  const expiryDate = formData.get("expiryDate") as string

  if (!title) return { error: "Title is required" }

  const evidence = await db.evidence.create({
    data: {
      orgId,
      title,
      description: description || null,
      type: (type as any) || "DOCUMENT",
      controlImplementationId: controlImplementationId || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  })

  revalidatePath(`/org/[orgSlug]/evidence`)
  return { id: evidence.id }
}

export async function deleteEvidence(evidenceId: string) {
  await db.evidence.update({
    where: { id: evidenceId },
    data: { deletedAt: new Date() },
  })
  revalidatePath(`/org/[orgSlug]/evidence`)
  return { success: true }
}
