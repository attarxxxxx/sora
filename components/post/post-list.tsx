import { Fragment } from "react"
import Link from "next/link"
import { HomeIcon } from "@solar-icons/react/linear/home"

import { PostCard } from "@/components/post/post-card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import type { FeedPost, FeedTab } from "@/lib/posts"

export function PostList({
  posts,
  nextCursor,
  isSignedIn,
  tab = "for-you",
}: {
  posts: FeedPost[]
  nextCursor: string | null
  isSignedIn: boolean
  tab?: FeedTab
}) {
  if (posts.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HomeIcon />
          </EmptyMedia>
          <EmptyTitle>
            {tab === "following" ? "No posts from your following yet" : "No posts yet"}
          </EmptyTitle>
          <EmptyDescription>
            {tab === "following"
              ? "Follow people to see their posts here."
              : "When someone shares a thought, it will show up here."}
          </EmptyDescription>
        </EmptyHeader>
        {!isSignedIn && (
          <EmptyContent>
            <Button nativeButton={false} render={<Link href="/signup" />}>Create an account</Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
    <div className="flex flex-col">
      {posts.map((post, index) => (
        <Fragment key={post.id}>
          {index > 0 && <Separator />}
          <PostCard post={post} isSignedIn={isSignedIn} />
        </Fragment>
      ))}

      {nextCursor && (
        <div className="border-t px-4 py-4">
          <Button
            variant="outline"
            render={
              <Link
                href={
                  tab === "following"
                    ? `/?tab=following&cursor=${encodeURIComponent(nextCursor)}`
                    : `/?cursor=${encodeURIComponent(nextCursor)}`
                }
              />
            }
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
