"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

type ActionResult = {
  ok: boolean
  error?: string
}

export async function markNotificationReadAction(
  notificationId: string
): Promise<ActionResult> {
  const session = await requireUser()

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { id: true, recipientId: true },
  })

  if (!notification || notification.recipientId !== session.user.id) {
    return { ok: false, error: "Notification not found." }
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  })

  revalidatePath("/notifications")
  return { ok: true }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  const session = await requireUser()

  await prisma.notification.updateMany({
    where: { recipientId: session.user.id, readAt: null },
    data: { readAt: new Date() },
  })

  revalidatePath("/notifications")
  return { ok: true }
}
