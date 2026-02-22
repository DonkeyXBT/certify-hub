import { db } from "@/lib/db"

export async function getMembers(orgId: string) {
  return db.membership.findMany({
    where: { orgId, isActive: true },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  })
}

export async function getInvitations(orgId: string) {
  return db.invitation.findMany({
    where: { orgId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  })
}
