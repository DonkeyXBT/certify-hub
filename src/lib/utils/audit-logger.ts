import { db } from "@/lib/db"
import type { ActivityAction } from "@prisma/client"
import type { Prisma } from "@prisma/client"

interface CreateAuditLogParams {
  orgId: string
  userId?: string
  action: ActivityAction
  entityType: string
  entityId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

/**
 * Create an audit log entry for tracking changes and user activity.
 * This function is designed to be fire-and-forget in most cases, but can
 * be awaited when the caller needs to ensure the log was written.
 */
export async function createAuditLog({
  orgId,
  userId,
  action,
  entityType,
  entityId,
  oldValues,
  newValues,
  metadata,
}: CreateAuditLogParams) {
  try {
    return await db.auditLog.create({
      data: {
        orgId,
        userId: userId ?? null,
        action,
        entityType,
        entityId,
        oldValues: oldValues as Prisma.InputJsonValue | undefined,
        newValues: newValues as Prisma.InputJsonValue | undefined,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    })
  } catch (error) {
    // Log to console but do not throw -- audit logging should not break
    // the primary operation.
    console.error("[AuditLogger] Failed to create audit log entry:", error)
    return null
  }
}

/**
 * Compute a diff of old vs new values, returning only the fields that changed.
 * Useful for storing minimal change information in audit logs.
 */
export function computeChangeDiff(
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>
): {
  old: Record<string, unknown>
  new: Record<string, unknown>
} {
  const changedOld: Record<string, unknown> = {}
  const changedNew: Record<string, unknown> = {}

  for (const key of Object.keys(newValues)) {
    if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
      changedOld[key] = oldValues[key]
      changedNew[key] = newValues[key]
    }
  }

  return { old: changedOld, new: changedNew }
}
