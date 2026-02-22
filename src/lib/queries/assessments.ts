import { db } from "@/lib/db"

export async function getAssessmentsByOrg(orgId: string) {
  return db.assessment.findMany({
    where: { orgId },
    include: {
      framework: {
        select: {
          id: true,
          code: true,
          name: true,
          version: true,
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })
}

export type AssessmentListItem = Awaited<
  ReturnType<typeof getAssessmentsByOrg>
>[number]

export async function getAssessmentById(assessmentId: string) {
  return db.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      framework: {
        include: {
          clauses: {
            where: { parentId: null },
            orderBy: { sortOrder: "asc" },
            include: {
              controls: { orderBy: { number: "asc" } },
              children: {
                orderBy: { sortOrder: "asc" },
                include: {
                  controls: { orderBy: { number: "asc" } },
                  children: {
                    orderBy: { sortOrder: "asc" },
                    include: { controls: { orderBy: { number: "asc" } } },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        include: {
          clause: {
            select: {
              id: true,
              number: true,
              title: true,
            },
          },
          control: {
            select: {
              id: true,
              number: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export type AssessmentWithResponses = NonNullable<
  Awaited<ReturnType<typeof getAssessmentById>>
>

export async function getAssessmentItems(frameworkId: string) {
  const clauses = await db.clause.findMany({
    where: {
      frameworkId,
      parentId: null,
    },
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
    orderBy: { sortOrder: "asc" },
  })

  // Flatten all assessable items (clauses with no children, or controls)
  type AssessableItem = {
    id: string
    type: "clause" | "control"
    number: string
    title: string
    clauseId?: string
    controlId?: string
    parentClause?: string
  }

  const items: AssessableItem[] = []

  function processClause(
    clause: (typeof clauses)[number],
    parentLabel?: string
  ) {
    const hasChildren =
      ("children" in clause && (clause.children as unknown[])?.length > 0) || false
    const hasControls = clause.controls?.length > 0

    if (hasControls) {
      for (const control of clause.controls) {
        items.push({
          id: control.id,
          type: "control",
          number: control.number,
          title: control.title,
          controlId: control.id,
          parentClause: `${clause.number} ${clause.title}`,
        })
      }
    } else if (!hasChildren) {
      items.push({
        id: clause.id,
        type: "clause",
        number: clause.number,
        title: clause.title,
        clauseId: clause.id,
        parentClause: parentLabel,
      })
    }

    if ("children" in clause && Array.isArray(clause.children)) {
      for (const child of clause.children) {
        processClause(child as typeof clause, `${clause.number} ${clause.title}`)
      }
    }
  }

  for (const clause of clauses) {
    processClause(clause)
  }

  return items
}

export type AssessableItem = Awaited<
  ReturnType<typeof getAssessmentItems>
>[number]

export async function getAssessmentResponses(assessmentId: string) {
  return db.assessmentResponse.findMany({
    where: { assessmentId },
    orderBy: { createdAt: "asc" },
  })
}
