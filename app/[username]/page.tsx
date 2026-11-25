import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Settings } from "reicon-react"

import { PostList } from "@/components/post/post-list"
import { FollowButton } from "@/components/profile/follow-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getProfile, getProfileMeta } from "@/lib/posts"
import { getSession } from "@/lib/session"

type ProfilePageProps = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getProfileMeta(username)

  if (!profile) {
    return { title: "Profile not found" }
  }

  const displayUsername = profile.username ?? username
  const title = `${profile.name} (@${displayUsername})`
  const description = profile.bio ?? `See posts from ${profile.name} on Sora.`

  return {
    title,
    description,
    alternates: { canonical: `/${displayUsername}` },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `/${displayUsername}`,
      images: profile.image ? [{ url: profile.image }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function Page({ params }: ProfilePageProps) {
  const { username } = await params
  const session = await getSession()
  const profile = await getProfile(username, session?.user.id)

  if (!profile) {
    notFound()
  }

  const { user, posts, postCount, followerCount, followingCount, isFollowing } =
    profile
  const displayUsername = user.username ?? username
  const isSelf = session?.user.id === user.id
  const isSignedIn = Boolean(session)

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <Button nativeButton={false}
          variant="ghost"
          size="sm"
          className="self-start"
          render={<Link href="/" />}
        >
          <ArrowLeft data-icon="inline-start" strokeWidth={2} />
          Back
        </Button>

        {user.coverImage && (
          <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg border">
            <Image
              src={user.coverImage}
              alt={`Cover image for ${user.name}`}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <Card size="sm">
          <CardHeader>
            <CardTitle>@{displayUsername}</CardTitle>
            <CardDescription>{user.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
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
                    {postCount} {postCount === 1 ? "post" : "posts"}
                  </span>
                </div>
              </div>

              {isSelf ? (
                <Button nativeButton={false}
                  variant="outline"
                  size="sm"
                  render={<Link href="/settings/profile" />}
                >
                  <Settings data-icon="inline-start" strokeWidth={2} />
                  Edit profile
                </Button>
              ) : (
                <FollowButton
                  userId={user.id}
                  isFollowing={isFollowing}
                  isSignedIn={isSignedIn}
                />
              )}
            </div>

            {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="font-medium text-foreground">
                  {followerCount}
                </strong>{" "}
                {followerCount === 1 ? "follower" : "followers"}
              </span>
              <span>
                <strong className="font-medium text-foreground">
                  {followingCount}
                </strong>{" "}
                following
              </span>
            </div>

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
          <PostList posts={posts} nextCursor={null} isSignedIn={isSignedIn} />
        </section>
      </div>
    </main>
  )
}
