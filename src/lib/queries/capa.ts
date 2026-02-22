import { db } from "@/lib/db"

export async function getCAPAs(orgId: string) {
  return db.cAPA.findMany({
    where: { orgId, deletedAt: null },
    include: { tasks: { select: { id: true, status: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCAPAById(capaId: string) {
  return db.cAPA.findUnique({
    where: { id: capaId },
    include: {
      tasks: {
        include: { assignee: { select: { id: true, name: true } } },
      },
    },
  })
}
