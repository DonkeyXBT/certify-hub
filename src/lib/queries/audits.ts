import { db } from "@/lib/db"
import type { AuditStatus, AuditType } from "@prisma/client"

// ─── Get Audits ─────────────────────────────────────────────────────────────

export async function getAudits(
  orgId: string,
  filters?: {
    status?: AuditStatus
    type?: AuditType
    search?: string
  },
) {
  const where = {
    orgId,
    deletedAt: null,
    ...(filters?.status && { status: filters.status }),
    ...(filters?.type && { type: filters.type }),
    ...(filters?.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" as const } },
        { scope: { contains: filters.search, mode: "insensitive" as const } },
      ],
    }),
  }

  const audits = await db.audit.findMany({
    where,
    include: {
      _count: {
        select: {
          teamMembers: true,
          findings: true,
          checklistItems: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return audits.map((audit) => ({
    id: audit.id,
    title: audit.title,
    type: audit.type,
    status: audit.status,
    scope: audit.scope,
    objectives: audit.objectives,
    startDate: audit.startDate,
    endDate: audit.endDate,
    reportDate: audit.reportDate,
    createdAt: audit.createdAt,
    updatedAt: audit.updatedAt,
    teamMemberCount: audit._count.teamMembers,
    findingCount: audit._count.findings,
    checklistItemCount: audit._count.checklistItems,
  }))
}

export type AuditListItem = Awaited<ReturnType<typeof getAudits>>[number]

// ─── Get Audit By ID ────────────────────────────────────────────────────────

export async function getAuditById(auditId: string, orgId: string) {
  const audit = await db.audit.findFirst({
    where: {
      id: auditId,
      orgId,
      deletedAt: null,
    },
    include: {
      teamMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      checklistItems: {
        orderBy: { sortOrder: "asc" },
      },
      findings: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return audit
}

export type AuditDetail = NonNullable<Awaited<ReturnType<typeof getAuditById>>>

// ─── Get Audit Findings ─────────────────────────────────────────────────────

export async function getAuditFindings(auditId: string) {
  return db.auditFinding.findMany({
    where: { auditId },
    orderBy: { createdAt: "desc" },
  })
}

export type AuditFindingItem = Awaited<ReturnType<typeof getAuditFindings>>[number]
