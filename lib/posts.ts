import { prisma } from "@/lib/prisma"

export const FEED_PAGE_SIZE = 10

export type PostAuthor = {
  id: string
  name: string
  username: string | null
  image: string | null
}

export type FeedPost = {
  id: string
  content: string
  createdAt: Date
  author: PostAuthor
}

export async function getFeed({
  cursor,
  limit = FEED_PAGE_SIZE,
}: {
  cursor?: string
  limit?: number
} = {}) {
  const posts = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  })

  const hasMore = posts.length > limit
  const visiblePosts = hasMore ? posts.slice(0, limit) : posts

  return {
    posts: visiblePosts,
    nextCursor: hasMore
      ? (visiblePosts[visiblePosts.length - 1]?.id ?? null)
      : null,
  }
}

export async function getProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: { posts: true },
      },
      posts: {
        take: 50,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  })

  if (!user) {
    return null
  }

  const author: PostAuthor = {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
  }

  return {
    user,
    posts: user.posts.map((post) => ({ ...post, author })),
  }
}
