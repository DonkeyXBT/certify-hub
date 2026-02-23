import { db } from "@/lib/db"
import {
  getAllFrameworksFromBlob,
  getFrameworkFromBlob,
  type BlobFrameworkData,
  type BlobClause,
  type BlobControl,
} from "@/lib/blob"

// ─── Helper: count controls in a clause tree ────────────────────────────────

function countClausesInTree(clauses: BlobClause[]): number {
  let count = clauses.length
  for (const c of clauses) count += countClausesInTree(c.children)
  return count
}

function countControlsInTree(clauses: BlobClause[]): number {
  let count = 0
  for (const c of clauses) {
    count += c.controls.length
    count += countControlsInTree(c.children)
  }
  return count
}

// ─── Framework list (reads from blob) ────────────────────────────────────────

export async function getFrameworks() {
  // Try blob first for fast reads
  const blobFrameworks = await getAllFrameworksFromBlob()

  if (blobFrameworks.length > 0) {
    return blobFrameworks
      .filter((fw) => fw.status === "PUBLISHED")
      .map((fw) => ({
        id: fw.id,
        code: fw.code,
        name: fw.name,
        version: fw.version,
        description: fw.description,
        status: fw.status,
        createdAt: new Date(),
        updatedAt: new Date(),
        clauseCount: countClausesInTree(fw.clauses),
        controlCount: countControlsInTree(fw.clauses),
      }))
  }

  // Fallback to database if blob is empty
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

// ─── Single framework with full clause tree (reads from blob) ────────────────

export async function getFrameworkWithClauses(frameworkId: string) {
  // Look up the framework code from a lightweight DB query
  const fw = await db.framework.findUnique({
    where: { id: frameworkId },
    select: { id: true, code: true, name: true, version: true, description: true, status: true },
  })

  if (!fw) return null

  // Try blob for the full tree
  const blobData = await getFrameworkFromBlob(fw.code)

  if (blobData) {
    return {
      id: blobData.id,
      code: blobData.code,
      name: blobData.name,
      version: blobData.version,
      description: blobData.description,
      status: blobData.status,
      clauses: blobData.clauses,
    }
  }

  // Fallback to deep nested Prisma query
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

// Keep types compatible — the shape matches both blob and Prisma returns
export type FrameworkWithClauses = {
  id: string
  code: string
  name: string
  version: string
  description: string | null
  status: string
  clauses: BlobClause[]
}

export type ClauseWithChildren = BlobClause

// ─── Framework controls flat list (reads from blob) ──────────────────────────

export async function getFrameworkControls(frameworkId: string) {
  // Try blob first
  const fw = await db.framework.findUnique({
    where: { id: frameworkId },
    select: { code: true },
  })

  if (fw) {
    const blobData = await getFrameworkFromBlob(fw.code)
    if (blobData) {
      const controls: {
        id: string
        number: string
        title: string
        category: string | null
        objective: string | null
        guidance: string | null
        clauseId: string
        clause: { id: string; number: string; title: string }
      }[] = []

      function extractControls(clauses: BlobClause[]) {
        for (const clause of clauses) {
          for (const ctrl of clause.controls) {
            controls.push({
              ...ctrl,
              clauseId: clause.id,
              clause: { id: clause.id, number: clause.number, title: clause.title },
            })
          }
          extractControls(clause.children)
        }
      }

      extractControls(blobData.clauses)
      return controls.sort((a, b) =>
        a.number.localeCompare(b.number, undefined, { numeric: true })
      )
    }
  }

  // Fallback to database
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

// ─── Compliance stats (stays in Postgres — needs org-specific data) ──────────

export interface FrameworkComplianceStat {
  total: number
  fullyImplemented: number
  partiallyImplemented: number
  percentage: number
}

export async function getFrameworkComplianceStats(
  orgId: string
): Promise<Record<string, FrameworkComplianceStat>> {
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

// Re-export blob types for consumers
export type { BlobFrameworkData, BlobClause, BlobControl }
