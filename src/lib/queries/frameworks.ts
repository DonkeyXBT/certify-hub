import { db } from "@/lib/db"

export async function getFrameworks() {
  const frameworks = await db.framework.findMany({
    where: { status: "PUBLISHED" },
    include: {
      clauses: {
        select: {
          id: true,
          controls: {
            select: { id: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return frameworks.map((framework) => {
    const clauseCount = framework.clauses.length
    const controlCount = framework.clauses.reduce(
      (sum, clause) => sum + clause.controls.length,
      0
    )

    return {
      id: framework.id,
      code: framework.code,
      name: framework.name,
      version: framework.version,
      description: framework.description,
      status: framework.status,
      createdAt: framework.createdAt,
      updatedAt: framework.updatedAt,
      clauseCount,
      controlCount,
    }
  })
}

export type FrameworkListItem = Awaited<
  ReturnType<typeof getFrameworks>
>[number]

export async function getFrameworkWithClauses(frameworkId: string) {
  const framework = await db.framework.findUnique({
    where: { id: frameworkId },
    include: {
      clauses: {
        where: { parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          controls: {
            orderBy: { number: "asc" },
          },
          children: {
            orderBy: { sortOrder: "asc" },
            include: {
              controls: {
                orderBy: { number: "asc" },
              },
              children: {
                orderBy: { sortOrder: "asc" },
                include: {
                  controls: {
                    orderBy: { number: "asc" },
                  },
                  children: {
                    orderBy: { sortOrder: "asc" },
                    include: {
                      controls: {
                        orderBy: { number: "asc" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  return framework
}

export type FrameworkWithClauses = NonNullable<
  Awaited<ReturnType<typeof getFrameworkWithClauses>>
>

export type ClauseWithChildren =
  FrameworkWithClauses["clauses"][number]

export async function getFrameworkControls(frameworkId: string) {
  const controls = await db.control.findMany({
    where: {
      clause: {
        frameworkId,
      },
    },
    include: {
      clause: {
        select: {
          id: true,
          number: true,
          title: true,
        },
      },
    },
    orderBy: { number: "asc" },
  })

  return controls
}

export type FrameworkControl = Awaited<
  ReturnType<typeof getFrameworkControls>
>[number]

export interface FrameworkComplianceStat {
  total: number
  fullyImplemented: number
  partiallyImplemented: number
  percentage: number
}

export async function getFrameworkComplianceStats(
  orgId: string
): Promise<Record<string, FrameworkComplianceStat>> {
  // Get all controls grouped by framework, with their implementation status
  const controls = await db.control.findMany({
    where: { clause: { framework: { status: "PUBLISHED" } } },
    select: {
      id: true,
      clause: { select: { frameworkId: true } },
      implementations: {
        where: { orgId },
        select: { status: true },
        take: 1,
      },
    },
  })

  const statsMap: Record<
    string,
    { total: number; fullyImplemented: number; partiallyImplemented: number }
  > = {}

  for (const control of controls) {
    const fwId = control.clause.frameworkId
    if (!statsMap[fwId]) {
      statsMap[fwId] = { total: 0, fullyImplemented: 0, partiallyImplemented: 0 }
    }
    statsMap[fwId].total++

    const impl = control.implementations[0]
    if (impl) {
      if (impl.status === "FULLY_IMPLEMENTED") {
        statsMap[fwId].fullyImplemented++
      } else if (impl.status === "PARTIALLY_IMPLEMENTED") {
        statsMap[fwId].partiallyImplemented++
      }
    }
  }

  const result: Record<string, FrameworkComplianceStat> = {}
  for (const [fwId, stats] of Object.entries(statsMap)) {
    const percentage =
      stats.total > 0
        ? Math.round(
            ((stats.fullyImplemented + stats.partiallyImplemented * 0.5) /
              stats.total) *
              100
          )
        : 0
    result[fwId] = { ...stats, percentage }
  }

  return result
}
