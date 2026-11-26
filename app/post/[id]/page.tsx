import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "@solar-icons/react/linear/arrow-left"

import { PostCard } from "@/components/post/post-card"
import { ReplyComposer } from "@/components/post/reply-composer"
import { ReplyList } from "@/components/post/reply-list"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getPost, getPostMeta, getReplies } from "@/lib/posts"
import { getSession } from "@/lib/session"

type PostPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params
  const post = await getPostMeta(id)

  if (!post) {
    return { title: "Post not found" }
  }

  const title = `Post by ${post.author.name}`
  const description =
    post.content.trim().slice(0, 160) ||
    `View this post and its replies on Sora.`

  return {
    title,
    description,
    alternates: { canonical: `/post/${id}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/post/${id}`,
      publishedTime: post.createdAt.toISOString(),
      images: post.images[0] ? [{ url: post.images[0].url }] : undefined,
    },
    twitter: {
      card: post.images[0] ? "summary_large_image" : "summary",
      title,
      description,
    },
  }
}

export default async function Page({ params }: PostPageProps) {
  const { id } = await params
  const session = await getSession()
  const viewerId = session?.user.id

  const [post, replies] = await Promise.all([
    getPost(id, viewerId),
    getReplies(id, viewerId),
  ])

  if (!post) {
    notFound()
  }

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
          <ArrowLeftIcon data-icon="inline-start" />
          Back
        </Button>

        <Card size="sm" className="py-0">
          <CardContent className="px-0">
            <PostCard post={post} isSignedIn={isSignedIn} />
          </CardContent>
        </Card>

        {isSignedIn ? (
          <ReplyComposer parentId={post.id} />
        ) : (
          <Card size="sm">
            <CardHeader>
              <CardTitle>Join the conversation</CardTitle>
              <CardDescription>Log in to reply to this post.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button nativeButton={false} render={<Link href="/signup" />}>Sign up</Button>
              <Button nativeButton={false} variant="outline" render={<Link href="/login" />}>
                Log in
              </Button>
            </CardContent>
          </Card>
        )}

        <section aria-label="Replies">
          <ReplyList replies={replies} isSignedIn={isSignedIn} />
        </section>
      </div>
    </main>
  )
}
