"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { NOTIFICATIONS_CHANGED_EVENT } from "@/lib/notification-events"

export function NotificationBadge({ className }: { className?: string }) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let active = true

    async function load() {
      try {
        const response = await fetch("/api/notifications/unread-count", {
          cache: "no-store",
        })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as { count?: number }

        if (active) {
          setCount(data.count ?? 0)
        }
      } catch {
        if (active) {
          setCount(0)
        }
      }
    }

    void load()
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, load)

    return () => {
      active = false
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, load)
    }
  }, [])

  if (count <= 0) {
    return null
  }

  return (
    <Badge
      variant="destructive"
      className={className}
      aria-label={`${count} unread notifications`}
    >
      {count > 9 ? "9+" : count}
    </Badge>
  )
}
