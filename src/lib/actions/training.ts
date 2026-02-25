"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createTrainingProgram(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const orgSlug = formData.get("orgSlug") as string
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

  revalidatePath(`/org/${orgSlug}/training`)
  return { id: program.id }
}

export async function assignTraining(
  programId: string,
  userIds: string[],
  orgSlug: string
) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  for (const userId of userIds) {
    await db.trainingRecord.upsert({
      where: { programId_userId: { programId, userId } },
      create: { programId, userId, status: "NOT_STARTED" },
      update: {},
    })
  }

  revalidatePath(`/org/${orgSlug}/training`)
  revalidatePath(`/org/${orgSlug}/training/${programId}`)
  return { success: true }
}

export async function updateTrainingRecord(
  recordId: string,
  data: { status?: string; score?: number },
  orgSlug: string
) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const updateData: Record<string, unknown> = {}
  if (data.status) updateData.status = data.status
  if (data.score !== undefined) updateData.score = data.score
  if (data.status === "COMPLETED") updateData.completedAt = new Date()
  if (data.status === "IN_PROGRESS" ) updateData.startedAt = new Date()

  const record = await db.trainingRecord.update({
    where: { id: recordId },
    data: updateData,
    include: { program: { select: { id: true } } },
  })

  revalidatePath(`/org/${orgSlug}/training`)
  revalidatePath(`/org/${orgSlug}/training/${record.program.id}`)
  return { success: true }
}

export async function deleteTrainingProgram(programId: string, orgSlug: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.trainingProgram.delete({ where: { id: programId } })

  revalidatePath(`/org/${orgSlug}/training`)
  return { success: true }
}

export async function removeTrainingRecord(recordId: string, orgSlug: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const record = await db.trainingRecord.delete({
    where: { id: recordId },
    include: { program: { select: { id: true } } },
  })

  revalidatePath(`/org/${orgSlug}/training`)
  revalidatePath(`/org/${orgSlug}/training/${record.program.id}`)
  return { success: true }
}

// Self-service: members can only update their own records (start / complete)
export async function selfUpdateTraining(
  recordId: string,
  action: "start" | "complete",
  orgSlug: string,
  score?: number
) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  // Fetch the record and verify ownership
  const record = await db.trainingRecord.findUnique({
    where: { id: recordId },
    select: { userId: true, status: true, program: { select: { id: true } } },
  })
  if (!record) return { error: "Training record not found" }
  if (record.userId !== session.user.id) return { error: "Unauthorized" }

  const updateData: Record<string, unknown> = {}
  if (action === "start") {
    if (record.status !== "NOT_STARTED") return { error: "Training already started" }
    updateData.status = "IN_PROGRESS"
    updateData.startedAt = new Date()
  } else {
    if (record.status === "COMPLETED") return { error: "Training already completed" }
    updateData.status = "COMPLETED"
    updateData.completedAt = new Date()
    if (record.status === "NOT_STARTED") updateData.startedAt = new Date()
    if (score !== undefined) updateData.score = score
  }

  await db.trainingRecord.update({ where: { id: recordId }, data: updateData })

  revalidatePath(`/org/${orgSlug}/training`)
  revalidatePath(`/org/${orgSlug}/training/${record.program.id}`)
  return { success: true }
}
