import { Fragment } from "react"
import Link from "next/link"
import { Home } from "reicon-react"

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
import type { FeedPost } from "@/lib/posts"

export function PostList({
  posts,
  nextCursor,
  isSignedIn,
}: {
  posts: FeedPost[]
  nextCursor: string | null
  isSignedIn: boolean
}) {
  if (posts.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Home />
          </EmptyMedia>
          <EmptyTitle>No posts yet</EmptyTitle>
          <EmptyDescription>
            When someone shares a thought, it will show up here.
          </EmptyDescription>
        </EmptyHeader>
        {!isSignedIn && (
          <EmptyContent>
            <Button render={<Link href="/signup" />}>Create an account</Button>
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
          <PostCard post={post} />
        </Fragment>
      ))}

      {nextCursor && (
        <div className="border-t px-4 py-4">
          <Button
            variant="outline"
            render={
              <Link href={`/?cursor=${encodeURIComponent(nextCursor)}`} />
            }
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
