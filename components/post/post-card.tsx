import Link from "next/link"

import { PostActions } from "@/components/post/post-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelativeTime } from "@/lib/format"
import type { FeedPost } from "@/lib/posts"

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return initials || "?"
}

export function PostCard({
  post,
  isSignedIn,
}: {
  post: FeedPost
  isSignedIn: boolean
}) {
  const username = post.author.username ?? post.author.id
  const profileHref = `/${username}`

  return (
    <article className="flex gap-3 px-4 py-5">
      <Link
        href={profileHref}
        className="shrink-0"
        aria-label={post.author.name}
      >
        <Avatar>
          <AvatarImage
            src={post.author.image ?? undefined}
            alt={post.author.name}
          />
          <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          <Link href={profileHref} className="font-medium hover:underline">
            {post.author.name}
          </Link>
          <Link
            href={profileHref}
            className="text-muted-foreground hover:underline"
          >
            @{username}
          </Link>
          <span aria-hidden="true" className="text-muted-foreground">
            ·
          </span>
          <time
            dateTime={post.createdAt.toISOString()}
            title={post.createdAt.toLocaleString("en", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            className="text-muted-foreground"
          >
            {formatRelativeTime(post.createdAt)}
          </time>
        </div>

        {post.parent && (
          <Link
            href={`/post/${post.parent.id}`}
            className="mt-1 block text-sm text-muted-foreground hover:underline"
          >
            Replying to @{post.parent.author.username ?? post.parent.author.id}
          </Link>
        )}

        <p className="mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
          {post.content}
        </p>

        <PostActions
          postId={post.id}
          isSignedIn={isSignedIn}
          likeCount={post.likeCount}
          replyCount={post.replyCount}
          repostCount={post.repostCount}
          likedByMe={post.likedByMe}
          repostedByMe={post.repostedByMe}
          bookmarkedByMe={post.bookmarkedByMe}
        />
      </div>
    </article>
  )
}
