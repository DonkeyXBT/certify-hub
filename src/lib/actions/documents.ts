"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createDocument(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const reviewCycle = formData.get("reviewCycle") as string
  const fileUrl = formData.get("fileUrl") as string
  const fileName = formData.get("fileName") as string

  if (!title) return { error: "Title is required" }

  const doc = await db.document.create({
    data: {
      orgId,
      title,
      description: description || null,
      category: category || null,
      reviewCycle: reviewCycle ? parseInt(reviewCycle) : null,
      status: "DRAFT",
    },
  })

  if (fileUrl) {
    await db.documentVersion.create({
      data: {
        documentId: doc.id,
        versionNumber: 1,
        fileName: fileName || "document",
        fileUrl,
        isActive: true,
      },
    })
  }

  revalidatePath(`/org/[orgSlug]/documents`)
  return { id: doc.id }
}

export async function updateDocumentStatus(documentId: string, action: "SUBMITTED" | "APPROVED" | "REJECTED") {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const statusMap = {
    SUBMITTED: "PENDING_REVIEW" as const,
    APPROVED: "APPROVED" as const,
    REJECTED: "DRAFT" as const,
  }

  await db.document.update({
    where: { id: documentId },
    data: { status: statusMap[action] },
  })

  await db.documentApproval.create({
    data: {
      documentId,
      userId: session.user.id,
      action,
      stepOrder: 1,
    },
  })

  revalidatePath(`/org/[orgSlug]/documents`)
  return { success: true }
}

export async function deleteDocument(documentId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.document.update({
    where: { id: documentId },
    data: { deletedAt: new Date() },
  })

  revalidatePath(`/org/[orgSlug]/documents`)
  return { success: true }
}
