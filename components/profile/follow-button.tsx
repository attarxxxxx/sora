"use client"

import * as React from "react"
import Link from "next/link"

import { toggleFollowAction } from "@/app/actions/interactions"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { notifyNotificationsChanged } from "@/lib/notification-events"

export function FollowButton({
  userId,
  isFollowing,
  isSignedIn,
}: {
  userId: string
  isFollowing: boolean
  isSignedIn: boolean
}) {
  const [isPending, startTransition] = React.useTransition()
  const [optimisticFollowing, applyOptimistic] = React.useOptimistic(
    isFollowing,
    (current: boolean, next: boolean) => (next === current ? current : next)
  )

  if (!isSignedIn) {
    return <Button render={<Link href="/login" />}>Follow</Button>
  }

  function toggle() {
    startTransition(async () => {
      applyOptimistic(!isFollowing)
      const result = await toggleFollowAction(userId)

      if (!result.ok) {
        toast.add({
          title: "Could not update follow",
          description: result.error ?? "Please try again.",
          type: "error",
        })
        return
      }

      notifyNotificationsChanged()
    })
  }

  return (
    <Button
      variant={optimisticFollowing ? "outline" : "default"}
      disabled={isPending}
      aria-pressed={optimisticFollowing}
      onClick={toggle}
    >
      {optimisticFollowing ? "Following" : "Follow"}
    </Button>
  )
}
