import { db } from "@/lib/db"
import type { DocumentStatus } from "@prisma/client"

// ─── Get Documents ──────────────────────────────────────────────────────────

export async function getDocuments(
  orgId: string,
  filters?: {
    status?: DocumentStatus
    category?: string
    search?: string
  },
) {
  const where = {
    orgId,
    deletedAt: null,
    ...(filters?.status && { status: filters.status }),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" as const } },
        { description: { contains: filters.search, mode: "insensitive" as const } },
      ],
    }),
  }

  const documents = await db.document.findMany({
    where,
    include: {
      versions: {
        where: { isActive: true },
        take: 1,
        select: {
          id: true,
          versionNumber: true,
          fileName: true,
          fileUrl: true,
        },
      },
      _count: {
        select: { versions: true, approvals: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    status: doc.status,
    category: doc.category,
    reviewCycle: doc.reviewCycle,
    nextReview: doc.nextReview,
    tags: doc.tags,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    currentVersion: doc.versions[0] ?? null,
    versionCount: doc._count.versions,
    approvalCount: doc._count.approvals,
  }))
}

export type DocumentListItem = Awaited<ReturnType<typeof getDocuments>>[number]

// ─── Get Document By ID ─────────────────────────────────────────────────────

export async function getDocumentById(documentId: string, orgId: string) {
  const document = await db.document.findFirst({
    where: {
      id: documentId,
      orgId,
      deletedAt: null,
    },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          id: true,
          versionNumber: true,
          fileName: true,
          fileUrl: true,
          fileSize: true,
          changelog: true,
          isActive: true,
          createdAt: true,
        },
      },
      approvals: {
        orderBy: { stepOrder: "asc" },
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
    },
  })

  return document
}

export type DocumentDetail = NonNullable<Awaited<ReturnType<typeof getDocumentById>>>
