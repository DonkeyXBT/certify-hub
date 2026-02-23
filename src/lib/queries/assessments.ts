import { db } from "@/lib/db"
import { getFrameworkFromBlob, type BlobClause } from "@/lib/blob"

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
  // Lightweight assessment query — no deep framework include
  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      framework: {
        select: {
          id: true,
          code: true,
          name: true,
          version: true,
          description: true,
          status: true,
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

  if (!assessment) return null

  // Get the full clause tree from blob (fast) or fallback to DB
  const blobData = await getFrameworkFromBlob(assessment.framework.code)

  let clauses: BlobClause[]
  if (blobData) {
    clauses = blobData.clauses
  } else {
    // Fallback: deep nested Prisma query
    const frameworkData = await db.framework.findUnique({
      where: { id: assessment.framework.id },
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
    })
    clauses = (frameworkData?.clauses ?? []) as unknown as BlobClause[]
  }

  // Return combined shape
  return {
    ...assessment,
    framework: {
      ...assessment.framework,
      clauses,
    },
  }
}

export type AssessmentWithResponses = NonNullable<
  Awaited<ReturnType<typeof getAssessmentById>>
>

export async function getAssessmentItems(frameworkId: string) {
  // Try blob first
  const fw = await db.framework.findUnique({
    where: { id: frameworkId },
    select: { code: true },
  })

  let clauses: any[]

  if (fw) {
    const blobData = await getFrameworkFromBlob(fw.code)
    if (blobData) {
      clauses = blobData.clauses
    } else {
      clauses = await db.clause.findMany({
        where: { frameworkId, parentId: null },
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
        orderBy: { sortOrder: "asc" },
      })
    }
  } else {
    clauses = []
  }

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

  function processClause(clause: any, parentLabel?: string) {
    const hasChildren = clause.children?.length > 0
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

    if (clause.children?.length > 0) {
      for (const child of clause.children) {
        processClause(child, `${clause.number} ${clause.title}`)
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
