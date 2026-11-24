import { Fragment } from "react"

import { PostCard } from "@/components/post/post-card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import type { FeedPost } from "@/lib/posts"

export function ReplyList({
  replies,
  isSignedIn,
}: {
  replies: FeedPost[]
  isSignedIn: boolean
}) {
  if (replies.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>No replies yet</EmptyTitle>
          <EmptyDescription>
            Be the first to add to this conversation.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col">
      {replies.map((reply, index) => (
        <Fragment key={reply.id}>
          {index > 0 && <Separator />}
          <PostCard post={reply} isSignedIn={isSignedIn} />
        </Fragment>
      ))}
    </div>
  )
}
