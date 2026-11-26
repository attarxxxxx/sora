"use client"

import * as React from "react"
import Link from "next/link"
import { BookmarkIcon } from "@solar-icons/react/linear/bookmark"
import { HeartIcon } from "@solar-icons/react/linear/heart"
import { ChatRoundIcon } from "@solar-icons/react/linear/chat-round"
import { RepeatIcon } from "@solar-icons/react/linear/repeat"

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
          <HeartIcon data-icon="inline-start" />
          {optimistic.likeCount}
        </Button>
      ) : (
        <Button nativeButton={false}
          variant="ghost"
          size="sm"
          aria-label="Like"
          render={<Link href="/login" />}
        >
          <HeartIcon data-icon="inline-start" />
          {optimistic.likeCount}
        </Button>
      )}

      <Button nativeButton={false}
        variant="ghost"
        size="sm"
        aria-label="Replies"
        render={<Link href={`/post/${postId}`} />}
      >
        <ChatRoundIcon data-icon="inline-start" />
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
          <RepeatIcon data-icon="inline-start" />
          {optimistic.repostCount}
        </Button>
      ) : (
        <Button nativeButton={false}
          variant="ghost"
          size="sm"
          aria-label="Repost"
          render={<Link href="/login" />}
        >
          <RepeatIcon data-icon="inline-start" />
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
          <BookmarkIcon data-icon="inline-start" />
        </Button>
      ) : (
        <Button nativeButton={false}
          variant="ghost"
          size="icon-sm"
          aria-label="Bookmark"
          render={<Link href="/login" />}
        >
          <BookmarkIcon data-icon="inline-start" />
        </Button>
      )}

      <SharePostButton postId={postId} />

      {isMine && <DeletePostButton postId={postId} />}
    </div>
  )
}
