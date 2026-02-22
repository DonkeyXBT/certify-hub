import { db } from "@/lib/db"

export async function getEvidence(orgId: string) {
  return db.evidence.findMany({
    where: { orgId, deletedAt: null },
    include: {
      controlImplementation: {
        include: { control: { select: { number: true, title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getEvidenceById(evidenceId: string) {
  return db.evidence.findUnique({
    where: { id: evidenceId },
    include: {
      controlImplementation: {
        include: { control: true },
      },
    },
  })
}
