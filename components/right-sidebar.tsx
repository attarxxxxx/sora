import Link from "next/link"
import { Search } from "reicon-react"

import { FollowButton } from "@/components/profile/follow-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

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

export async function RightSidebar() {
  const session = await getSession()
  const viewerId = session?.user.id

  const following = viewerId
    ? await prisma.follow.findMany({
        where: { followerId: viewerId },
        select: { followingId: true },
      })
    : []

  const excludedIds = viewerId
    ? [viewerId, ...following.map((entry) => entry.followingId)]
    : []

  const suggestions = await prisma.user.findMany({
    where: excludedIds.length > 0 ? { id: { notIn: excludedIds } } : undefined,
    take: 4,
    orderBy: [{ followers: { _count: "desc" } }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      _count: {
        select: { followers: true },
      },
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <form action="/search" method="get" role="search">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            name="q"
            placeholder="Search Sora"
            aria-label="Search Sora"
          />
          <Button type="submit" size="icon-sm" aria-label="Search">
            <Search strokeWidth={2} />
          </Button>
        </div>
      </form>

      <Card size="sm" className="py-0">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-sm">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No suggestions right now.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {suggestions.map((user) => {
                const username = user.username ?? user.id
                const profileHref = `/${username}`

                return (
                  <li key={user.id} className="flex items-center gap-3">
                    <Link
                      href={profileHref}
                      className="shrink-0"
                      aria-label={user.name}
                    >
                      <Avatar className="size-9">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name}
                        />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={profileHref}
                        className="block truncate text-sm font-medium hover:underline"
                      >
                        {user.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        @{username} · {user._count.followers}{" "}
                        {user._count.followers === 1 ? "follower" : "followers"}
                      </p>
                    </div>

                    <FollowButton
                      userId={user.id}
                      isFollowing={false}
                      isSignedIn={Boolean(session)}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
