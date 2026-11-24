import Link from "next/link"

import { PostComposer } from "@/components/post/post-composer"
import { PostList } from "@/components/post/post-list"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FEED_PAGE_SIZE, getFeed } from "@/lib/posts"
import { getSession } from "@/lib/session"

type HomePageProps = {
  searchParams: Promise<{
    cursor?: string | string[]
  }>
}

export default async function Page({ searchParams }: HomePageProps) {
  const query = await searchParams
  const cursor = typeof query.cursor === "string" ? query.cursor : undefined

  const [{ posts, nextCursor }, session] = await Promise.all([
    getFeed({ cursor, limit: FEED_PAGE_SIZE }),
    getSession(),
  ])

  const isSignedIn = Boolean(session)

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
          <p className="text-sm text-muted-foreground">
            Thoughts from everyone on Sora.
          </p>
        </div>

        {isSignedIn ? (
          <PostComposer />
        ) : (
          <Card size="sm">
            <CardHeader>
              <CardTitle>Join the conversation</CardTitle>
              <CardDescription>
                Log in to share your thoughts with everyone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button render={<Link href="/signup" />}>Sign up</Button>
              <Button variant="outline" render={<Link href="/login" />}>
                Log in
              </Button>
            </CardContent>
          </Card>
        )}

        <section aria-label="Feed">
          <PostList
            posts={posts}
            nextCursor={nextCursor}
            isSignedIn={isSignedIn}
          />
        </section>
      </div>
    </main>
  )
}
