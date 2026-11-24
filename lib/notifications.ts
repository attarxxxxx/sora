import { NotificationType } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"

export { NotificationType }

export type NotificationActor = {
  id: string
  name: string
  username: string | null
  image: string | null
}

export type NotificationItem = {
  id: string
  type: NotificationType
  readAt: Date | null
  createdAt: Date
  actor: NotificationActor
  post: {
    id: string
    content: string
  } | null
}

type CreateNotificationInput = {
  recipientId: string
  actorId: string
  type: NotificationType
  postId?: string | null
}

const notificationSelect = {
  id: true,
  type: true,
  readAt: true,
  createdAt: true,
  actor: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
  post: {
    select: {
      id: true,
      content: true,
    },
  },
} as const

export async function createNotification({
  recipientId,
  actorId,
  type,
  postId = null,
}: CreateNotificationInput) {
  if (recipientId === actorId) {
    return
  }

  const existing = await prisma.notification.findFirst({
    where: {
      recipientId,
      actorId,
      type,
      postId,
    },
    select: { id: true, readAt: true },
  })

  if (existing && !existing.readAt) {
    return
  }

  await prisma.notification.create({
    data: {
      recipientId,
      actorId,
      type,
      postId,
    },
  })
}

export async function getNotifications(
  recipientId: string
): Promise<NotificationItem[]> {
  const notifications = await prisma.notification.findMany({
    where: { recipientId },
    take: 50,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: notificationSelect,
  })

  return notifications
}

export async function getUnreadNotificationCount(recipientId: string) {
  return prisma.notification.count({
    where: { recipientId, readAt: null },
  })
}
