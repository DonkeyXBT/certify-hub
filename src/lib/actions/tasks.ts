"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { notifyTaskCreated, notifyTaskStatusChanged } from "@/lib/slack"

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
  const assessmentId = formData.get("assessmentId") as string

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
      assessmentId: assessmentId || null,
    },
  })

  // Fire Slack notification
  const [assignee, assessment, creator] = await Promise.all([
    assigneeId
      ? db.user.findUnique({ where: { id: assigneeId }, select: { name: true } })
      : null,
    assessmentId
      ? db.assessment.findUnique({ where: { id: assessmentId }, select: { name: true } })
      : null,
    db.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } }),
  ])

  await notifyTaskCreated(orgId, {
    taskTitle: task.title,
    creatorName: creator?.name || session.user.email || "Someone",
    assigneeName: assignee?.name ?? undefined,
    priority: task.priority,
    dueDate: task.dueDate,
    assessmentName: assessment?.name ?? undefined,
    orgSlug,
  })

  revalidatePath(`/org/${orgSlug}/tasks`)
  return { id: task.id }
}

export async function updateTaskStatus(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const taskId = formData.get("taskId") as string
  const newStatus = formData.get("status") as string
  const orgSlug = formData.get("orgSlug") as string

  // Fetch task details before update for notification
  const existing = await db.task.findUnique({
    where: { id: taskId },
    select: {
      title: true,
      status: true,
      orgId: true,
      assignee: { select: { name: true } },
    },
  })

  await db.task.update({
    where: { id: taskId },
    data: {
      status: newStatus as any,
      completedAt: newStatus === "COMPLETED" ? new Date() : null,
    },
  })

  // Fire Slack notification
  if (existing) {
    const changer = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    })
    await notifyTaskStatusChanged(existing.orgId, {
      taskTitle: existing.title,
      oldStatus: existing.status,
      newStatus,
      changedByName: changer?.name || session.user.email || "Someone",
      assigneeName: existing.assignee?.name ?? undefined,
      orgSlug,
    })
  }

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
  const riskId = formData.get("riskId") as string
  const controlImplementationId = formData.get("controlImplementationId") as string
  const capaId = formData.get("capaId") as string

  if (!title?.trim()) return { error: "Title is required" }

  await db.task.update({
    where: { id: taskId },
    data: {
      title: title.trim(),
      description: description || null,
      priority: (priority as any) || "MEDIUM",
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      riskId: riskId || null,
      controlImplementationId: controlImplementationId || null,
      capaId: capaId || null,
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
