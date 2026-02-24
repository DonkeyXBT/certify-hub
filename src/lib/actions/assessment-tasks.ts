"use server"

import { db } from "@/lib/db"
import { CERTIFICATION_TASKS } from "@/lib/data/certification-tasks"

/**
 * Generate certification tasks for an assessment when it first transitions to IN_PROGRESS.
 * Idempotent: skips if tasks already exist for this assessmentId.
 * Only generates for ISO27001, NIS2, and ISO9001 frameworks.
 */
export async function generateAssessmentTasks(
  assessmentId: string,
  orgId: string,
  frameworkCode: string
): Promise<{ created: number } | { skipped: true }> {
  const templates = CERTIFICATION_TASKS[frameworkCode]
  if (!templates) return { skipped: true }

  // Idempotency guard — do not create duplicates
  const existingCount = await db.task.count({
    where: { assessmentId, deletedAt: null },
  })
  if (existingCount > 0) return { skipped: true }

  const tasks = templates.map((template) => ({
    orgId,
    assessmentId,
    title: template.title,
    description: template.description,
    priority: template.priority,
    status: "TODO" as const,
  }))

  await db.task.createMany({ data: tasks })

  return { created: tasks.length }
}
