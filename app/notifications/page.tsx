import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "@solar-icons/react/linear/arrow-left"

import { MarkAllNotificationsReadButton } from "@/components/notification/notification-actions"
import { NotificationList } from "@/components/notification/notification-list"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/lib/notifications"
import { requireUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Recent activity on your Sora account.",
  robots: { index: false, follow: false },
}

export default async function Page() {
  const session = await requireUser()
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(session.user.id),
    getUnreadNotificationCount(session.user.id),
  ])

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <Button nativeButton={false}
          variant="ghost"
          size="sm"
          className="self-start"
          render={<Link href="/" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}`
                : "You are all caught up."}
            </p>
          </div>

          <MarkAllNotificationsReadButton hasUnread={unreadCount > 0} />
        </div>

        <Card size="sm" className="py-0">
          <CardHeader className="sr-only">
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Likes, replies, reposts, and followers.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <NotificationList notifications={notifications} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
