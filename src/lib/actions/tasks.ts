"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createTask(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const orgSlug = formData.get("orgSlug") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string
  const assigneeId = formData.get("assigneeId") as string
  const dueDate = formData.get("dueDate") as string
  const riskId = formData.get("riskId") as string
  const controlImplementationId = formData.get("controlImplementationId") as string
  const capaId = formData.get("capaId") as string

  if (!title?.trim()) return { error: "Title is required" }

  const task = await db.task.create({
    data: {
      orgId,
      title: title.trim(),
      description: description || null,
      priority: (priority as any) || "MEDIUM",
      assigneeId: assigneeId || null,
      creatorId: session.user.id,
      dueDate: dueDate ? new Date(dueDate) : null,
      riskId: riskId || null,
      controlImplementationId: controlImplementationId || null,
      capaId: capaId || null,
    },
  })

  revalidatePath(`/org/${orgSlug}/tasks`)
  return { id: task.id }
}

export async function updateTaskStatus(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const taskId = formData.get("taskId") as string
  const status = formData.get("status") as string
  const orgSlug = formData.get("orgSlug") as string

  await db.task.update({
    where: { id: taskId },
    data: {
      status: status as any,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  })

  revalidatePath(`/org/${orgSlug}/tasks`)
  return { success: true }
}

export async function updateTask(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const taskId = formData.get("taskId") as string
  const orgSlug = formData.get("orgSlug") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string
  const assigneeId = formData.get("assigneeId") as string
  const dueDate = formData.get("dueDate") as string

  if (!title?.trim()) return { error: "Title is required" }

  await db.task.update({
    where: { id: taskId },
    data: {
      title: title.trim(),
      description: description || null,
      priority: (priority as any) || "MEDIUM",
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })

  revalidatePath(`/org/${orgSlug}/tasks`)
  return { success: true }
}

export async function deleteTask(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const taskId = formData.get("taskId") as string
  const orgSlug = formData.get("orgSlug") as string

  await db.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  })

  revalidatePath(`/org/${orgSlug}/tasks`)
  return { success: true }
}
