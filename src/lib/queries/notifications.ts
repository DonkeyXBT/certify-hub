import { db } from "@/lib/db"

export async function getNotifications(userId: string, orgId: string, limit = 20) {
  return db.notification.findMany({
    where: { userId, orgId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getUnreadCount(userId: string, orgId: string) {
  return db.notification.count({
    where: { userId, orgId, isRead: false },
  })
}
