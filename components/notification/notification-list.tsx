import Link from "next/link"
import { Fragment } from "react"
import { Bell, Heart, Message, Repeat, UserAdd } from "reicon-react"

import { MarkNotificationReadButton } from "@/components/notification/notification-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { formatRelativeTime } from "@/lib/format"
import { NotificationType, type NotificationItem } from "@/lib/notifications"
import { cn } from "@/lib/utils"

const notificationMeta = {
  [NotificationType.LIKE]: {
    icon: Heart,
    description: "liked your post",
  },
  [NotificationType.REPOST]: {
    icon: Repeat,
    description: "reposted your post",
  },
  [NotificationType.REPLY]: {
    icon: Message,
    description: "replied to your post",
  },
  [NotificationType.FOLLOW]: {
    icon: UserAdd,
    description: "started following you",
  },
} as const

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

export function NotificationList({
  notifications,
}: {
  notifications: NotificationItem[]
}) {
  if (notifications.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bell strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>No notifications yet</EmptyTitle>
          <EmptyDescription>
            Likes, replies, reposts, and new followers will show up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col">
      {notifications.map((notification, index) => {
        const meta = notificationMeta[notification.type]
        const Icon = meta.icon
        const username = notification.actor.username ?? notification.actor.id
        const profileHref = `/${username}`
        const postHref = notification.post
          ? `/post/${notification.post.id}`
          : profileHref

        return (
          <Fragment key={notification.id}>
            {index > 0 && <Separator />}
            <div
              className={cn(
                "flex gap-3 px-4 py-4",
                !notification.readAt && "bg-muted/40"
              )}
            >
              <Link
                href={profileHref}
                className="shrink-0"
                aria-label={notification.actor.name}
              >
                <Avatar>
                  <AvatarImage
                    src={notification.actor.image ?? undefined}
                    alt={notification.actor.name}
                  />
                  <AvatarFallback>
                    {getInitials(notification.actor.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm leading-relaxed">
                      <Link
                        href={profileHref}
                        className="font-medium hover:underline"
                      >
                        {notification.actor.name}
                      </Link>{" "}
                      {meta.description}
                    </p>
                    <time
                      dateTime={notification.createdAt.toISOString()}
                      className="text-xs text-muted-foreground"
                    >
                      {formatRelativeTime(notification.createdAt)}
                    </time>
                  </div>

                  {!notification.readAt && (
                    <MarkNotificationReadButton
                      notificationId={notification.id}
                    />
                  )}
                </div>

                {notification.post && (
                  <Link
                    href={postHref}
                    className="mt-2 block rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {notification.post.content || "View post"}
                  </Link>
                )}
              </div>

              <Icon
                aria-hidden="true"
                className="hidden size-4 shrink-0 text-muted-foreground sm:block" strokeWidth={2} />
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
