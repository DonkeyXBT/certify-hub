"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { NotificationType } from "@prisma/client"

export async function createNotification(
  orgId: string,
  userId: string,
  type: NotificationType,
  title: string,
  message?: string,
  actionUrl?: string
) {
  await db.notification.create({
    data: { orgId, userId, type, title, message, actionUrl },
  })
}

export async function markAsRead(notificationId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  })

  revalidatePath(`/org/[orgSlug]`)
  return { success: true }
}

export async function markAllRead(orgId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.notification.updateMany({
    where: { orgId, userId: session.user.id, isRead: false },
    data: { isRead: true },
  })

  revalidatePath(`/org/[orgSlug]`)
  return { success: true }
}
