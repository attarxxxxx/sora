import Link from "next/link"
import { redirect } from "next/navigation"

import { FeedTabs } from "@/components/feed/feed-tabs"
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
import { FEED_PAGE_SIZE, getFeed, type FeedTab } from "@/lib/posts"
import { getSession } from "@/lib/session"

type HomePageProps = {
  searchParams: Promise<{
    cursor?: string | string[]
    tab?: string | string[]
  }>
}

export default async function Page({ searchParams }: HomePageProps) {
  const query = await searchParams
  const cursor = typeof query.cursor === "string" ? query.cursor : undefined
  const requestedTab = typeof query.tab === "string" ? query.tab : undefined
  const tab: FeedTab = requestedTab === "following" ? "following" : "for-you"

  const session = await getSession()
  const isSignedIn = Boolean(session)

  if (tab === "following" && !isSignedIn) {
    redirect("/")
  }

  const viewerId = session?.user.id

  const { posts, nextCursor } = await getFeed({
    cursor,
    limit: FEED_PAGE_SIZE,
    viewerId,
    tab,
  })

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
          <p className="text-sm text-muted-foreground">
            {tab === "following"
              ? "Thoughts from people you follow and your own posts."
              : "Thoughts from everyone on Sora."}
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
              <Button nativeButton={false} render={<Link href="/signup" />}>Sign up</Button>
              <Button nativeButton={false} variant="outline" render={<Link href="/login" />}>
                Log in
              </Button>
            </CardContent>
          </Card>
        )}

        <section aria-label="Feed posts">
          {isSignedIn ? (
            <FeedTabs activeTab={tab}>
              <PostList
                posts={posts}
                nextCursor={nextCursor}
                isSignedIn={isSignedIn}
                tab={tab}
              />
            </FeedTabs>
          ) : (
            <PostList
              posts={posts}
              nextCursor={nextCursor}
              isSignedIn={isSignedIn}
              tab={tab}
            />
          )}
        </section>
      </div>
    </main>
  )
}
