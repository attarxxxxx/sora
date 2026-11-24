import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { SearchUser } from "@/lib/search"

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

export function UserResultCard({ user }: { user: SearchUser }) {
  const username = user.username ?? user.id
  const profileHref = `/${username}`

  return (
    <article className="flex gap-3 px-4 py-4">
      <Link href={profileHref} className="shrink-0" aria-label={user.name}>
        <Avatar>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 text-sm">
          <Link href={profileHref} className="font-medium hover:underline">
            {user.name}
          </Link>
          <Link
            href={profileHref}
            className="text-muted-foreground hover:underline"
          >
            @{username}
          </Link>
        </div>

        {user.bio && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user.bio}
          </p>
        )}

        <p className="mt-1 text-xs text-muted-foreground">
          {user._count.posts} {user._count.posts === 1 ? "post" : "posts"} ·{" "}
          {user._count.followers}{" "}
          {user._count.followers === 1 ? "follower" : "followers"}
        </p>
      </div>
    </article>
  )
}
