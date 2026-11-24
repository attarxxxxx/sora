import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "reicon-react"

import { PostList } from "@/components/post/post-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getProfile } from "@/lib/posts"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Profile",
  description: "View a Sora profile and their posts.",
}

type ProfilePageProps = {
  params: Promise<{ username: string }>
}

export default async function Page({ params }: ProfilePageProps) {
  const { username } = await params

  const [profile, session] = await Promise.all([
    getProfile(username),
    getSession(),
  ])

  if (!profile) {
    notFound()
  }

  const { user, posts } = profile
  const displayUsername = user.username ?? username

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          render={<Link href="/" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>

        <Card size="sm">
          <CardHeader>
            <CardTitle>@{displayUsername}</CardTitle>
            <CardDescription>{user.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {user._count.posts}{" "}
                  {user._count.posts === 1 ? "post" : "posts"}
                </span>
              </div>
            </div>

            {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}

            <p className="text-sm text-muted-foreground">
              Joined{" "}
              {user.createdAt.toLocaleDateString("en", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>

        <section aria-label={`Posts by ${user.name}`}>
          <PostList
            posts={posts}
            nextCursor={null}
            isSignedIn={Boolean(session)}
          />
        </section>
      </div>
    </main>
  )
}
