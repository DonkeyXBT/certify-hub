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
