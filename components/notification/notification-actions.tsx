"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check } from "reicon-react"

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/actions/notifications"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { notifyNotificationsChanged } from "@/lib/notification-events"

export function MarkAllNotificationsReadButton({
  hasUnread,
}: {
  hasUnread: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function markAll() {
    startTransition(async () => {
      const result = await markAllNotificationsReadAction()

      if (!result.ok) {
        toast.add({
          title: "Could not update notifications",
          description: result.error ?? "Please try again.",
          type: "error",
        })
        return
      }

      notifyNotificationsChanged()
      router.refresh()
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={!hasUnread || isPending}
      onClick={markAll}
    >
      <Check data-icon="inline-start" />
      {isPending ? "Updating..." : "Mark all as read"}
    </Button>
  )
}

export function MarkNotificationReadButton({
  notificationId,
}: {
  notificationId: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function markRead() {
    startTransition(async () => {
      const result = await markNotificationReadAction(notificationId)

      if (!result.ok) {
        toast.add({
          title: "Could not update notification",
          description: result.error ?? "Please try again.",
          type: "error",
        })
        return
      }

      notifyNotificationsChanged()
      router.refresh()
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Mark as read"
      disabled={isPending}
      onClick={markRead}
    >
      <Check />
    </Button>
  )
}
