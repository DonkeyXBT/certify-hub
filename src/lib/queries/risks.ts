import { db } from "@/lib/db"

/**
 * Fetch all non-deleted risks for an organization, including their category.
 */
export async function getRisks(orgId: string) {
  return db.risk.findMany({
    where: { orgId, deletedAt: null },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
    orderBy: [{ inherentScore: "desc" }, { createdAt: "desc" }],
  })
}

/**
 * Fetch a single risk by ID, including category, control mappings,
 * and linked tasks.
 */
export async function getRiskById(riskId: string) {
  return db.risk.findUnique({
    where: { id: riskId, deletedAt: null },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      controlMappings: {
        include: {
          controlImplementation: {
            include: {
              control: {
                select: {
                  id: true,
                  number: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      tasks: {
        where: { deletedAt: null },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          assignee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

/**
 * Aggregate risk counts grouped by inherent risk level.
 */
export async function getRiskStats(orgId: string) {
  const risks = await db.risk.findMany({
    where: { orgId, deletedAt: null },
    select: {
      inherentLevel: true,
      residualLevel: true,
      status: true,
    },
  })

  const stats = {
    total: risks.length,
    byInherentLevel: {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    },
    byResidualLevel: {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    },
    openCount: 0,
  }

  for (const risk of risks) {
    stats.byInherentLevel[risk.inherentLevel]++
    stats.byResidualLevel[risk.residualLevel]++
    if (risk.status !== "CLOSED") {
      stats.openCount++
    }
  }

  return stats
}

/**
 * Fetch risk categories for an organization.
 */
export async function getRiskCategories(orgId: string) {
  return db.riskCategory.findMany({
    where: { orgId },
    select: {
      id: true,
      name: true,
      color: true,
    },
    orderBy: { name: "asc" },
  })
}
