"use client"

import * as React from "react"
import Link from "next/link"
import { Bookmark, Heart, Message, Repeat } from "reicon-react"

import {
  toggleBookmarkAction,
  toggleLikeAction,
  toggleRepostAction,
} from "@/app/actions/interactions"
import { DeletePostButton } from "@/components/post/delete-post-button"
import { SharePostButton } from "@/components/post/share-post-button"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { notifyNotificationsChanged } from "@/lib/notification-events"

type ToggleKey = "likedByMe" | "repostedByMe" | "bookmarkedByMe"

type InteractionState = {
  likeCount: number
  replyCount: number
  repostCount: number
  likedByMe: boolean
  repostedByMe: boolean
  bookmarkedByMe: boolean
}

const toggleActions = {
  likedByMe: toggleLikeAction,
  repostedByMe: toggleRepostAction,
  bookmarkedByMe: toggleBookmarkAction,
}

export function PostActions({
  postId,
  isSignedIn,
  isMine,
  ...state
}: InteractionState & {
  postId: string
  isSignedIn: boolean
  isMine: boolean
}) {
  const [isPending, startTransition] = React.useTransition()
  const [optimistic, applyOptimistic] = React.useOptimistic(
    state,
    (current: InteractionState, key: ToggleKey): InteractionState => {
      if (key === "likedByMe") {
        return {
          ...current,
          likedByMe: !current.likedByMe,
          likeCount: current.likeCount + (current.likedByMe ? -1 : 1),
        }
      }

      if (key === "repostedByMe") {
        return {
          ...current,
          repostedByMe: !current.repostedByMe,
          repostCount: current.repostCount + (current.repostedByMe ? -1 : 1),
        }
      }

      return {
        ...current,
        bookmarkedByMe: !current.bookmarkedByMe,
      }
    }
  )

  function toggle(key: ToggleKey) {
    startTransition(async () => {
      applyOptimistic(key)
      const result = await toggleActions[key](postId)

      if (!result.ok) {
        toast.add({
          title: "Could not update post",
          description: result.error ?? "Please try again.",
          type: "error",
        })
        return
      }

      if (key !== "bookmarkedByMe") {
        notifyNotificationsChanged()
      }
    })
  }

  return (
    <div className="mt-3 flex items-center gap-1">
      {isSignedIn ? (
        <Button
          variant={optimistic.likedByMe ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={optimistic.likedByMe}
          aria-label="Like"
          disabled={isPending}
          onClick={() => toggle("likedByMe")}
        >
          <Heart data-icon="inline-start" strokeWidth={2} />
          {optimistic.likeCount}
        </Button>
      ) : (
        <Button nativeButton={false}
          variant="ghost"
          size="sm"
          aria-label="Like"
          render={<Link href="/login" />}
        >
          <Heart data-icon="inline-start" strokeWidth={2} />
          {optimistic.likeCount}
        </Button>
      )}

      <Button nativeButton={false}
        variant="ghost"
        size="sm"
        aria-label="Replies"
        render={<Link href={`/post/${postId}`} />}
      >
        <Message data-icon="inline-start" strokeWidth={2} />
        {optimistic.replyCount}
      </Button>

      {isSignedIn ? (
        <Button
          variant={optimistic.repostedByMe ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={optimistic.repostedByMe}
          aria-label="Repost"
          disabled={isPending}
          onClick={() => toggle("repostedByMe")}
        >
          <Repeat data-icon="inline-start" strokeWidth={2} />
          {optimistic.repostCount}
        </Button>
      ) : (
        <Button nativeButton={false}
          variant="ghost"
          size="sm"
          aria-label="Repost"
          render={<Link href="/login" />}
        >
          <Repeat data-icon="inline-start" strokeWidth={2} />
          {optimistic.repostCount}
        </Button>
      )}

      {isSignedIn ? (
        <Button
          variant={optimistic.bookmarkedByMe ? "secondary" : "ghost"}
          size="icon-sm"
          aria-pressed={optimistic.bookmarkedByMe}
          aria-label="Bookmark"
          disabled={isPending}
          onClick={() => toggle("bookmarkedByMe")}
        >
          <Bookmark data-icon="inline-start" strokeWidth={2} />
        </Button>
      ) : (
        <Button nativeButton={false}
          variant="ghost"
          size="icon-sm"
          aria-label="Bookmark"
          render={<Link href="/login" />}
        >
          <Bookmark data-icon="inline-start" strokeWidth={2} />
        </Button>
      )}

      <SharePostButton postId={postId} />

      {isMine && <DeletePostButton postId={postId} />}
    </div>
  )
}
