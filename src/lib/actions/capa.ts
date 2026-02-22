"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createCAPA(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const type = formData.get("type") as string
  const source = formData.get("source") as string
  const dueDate = formData.get("dueDate") as string

  if (!title) return { error: "Title is required" }

  const capa = await db.cAPA.create({
    data: {
      orgId,
      title,
      description: description || null,
      type: (type as any) || "CORRECTIVE",
      source: source || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })

  revalidatePath(`/org/[orgSlug]/capa`)
  return { id: capa.id }
}

export async function updateCAPAStatus(capaId: string, status: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const data: Record<string, any> = { status: status as any }
  if (status === "CLOSED") data.closureDate = new Date()

  await db.cAPA.update({ where: { id: capaId }, data })

  revalidatePath(`/org/[orgSlug]/capa`)
  return { success: true }
}

export async function updateCAPA(capaId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.cAPA.update({
    where: { id: capaId },
    data: {
      rootCauseMethod: formData.get("rootCauseMethod") as string || null,
      rootCauseAnalysis: formData.get("rootCauseAnalysis") as string || null,
      immediateAction: formData.get("immediateAction") as string || null,
      correctiveAction: formData.get("correctiveAction") as string || null,
      preventiveAction: formData.get("preventiveAction") as string || null,
      verificationMethod: formData.get("verificationMethod") as string || null,
      verificationResult: formData.get("verificationResult") as string || null,
    },
  })

  revalidatePath(`/org/[orgSlug]/capa`)
  return { success: true }
}

export async function deleteCAPA(capaId: string) {
  await db.cAPA.update({
    where: { id: capaId },
    data: { deletedAt: new Date() },
  })
  revalidatePath(`/org/[orgSlug]/capa`)
  return { success: true }
}
