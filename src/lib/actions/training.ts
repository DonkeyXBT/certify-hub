"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createTrainingProgram(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const frequency = formData.get("frequency") as string
  const isMandatory = formData.get("isMandatory") === "true"
  const validityPeriod = formData.get("validityPeriod") as string
  const passingScore = formData.get("passingScore") as string

  if (!title) return { error: "Title is required" }

  const program = await db.trainingProgram.create({
    data: {
      orgId,
      title,
      description: description || null,
      frequency: frequency || null,
      isMandatory,
      validityPeriod: validityPeriod ? parseInt(validityPeriod) : null,
      passingScore: passingScore ? parseInt(passingScore) : null,
    },
  })

  revalidatePath(`/org/[orgSlug]/training`)
  return { id: program.id }
}

export async function assignTraining(programId: string, userIds: string[]) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  for (const userId of userIds) {
    await db.trainingRecord.upsert({
      where: { programId_userId: { programId, userId } },
      create: { programId, userId, status: "NOT_STARTED" },
      update: {},
    })
  }

  revalidatePath(`/org/[orgSlug]/training`)
  return { success: true }
}

export async function updateTrainingRecord(recordId: string, data: { status?: string; score?: number }) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.trainingRecord.update({
    where: { id: recordId },
    data: {
      status: data.status as any,
      score: data.score,
      completedAt: data.status === "COMPLETED" ? new Date() : undefined,
      startedAt: data.status === "IN_PROGRESS" ? new Date() : undefined,
    },
  })

  revalidatePath(`/org/[orgSlug]/training`)
  return { success: true }
}
