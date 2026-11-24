import { mapPost, postSelect, type FeedPost } from "@/lib/posts"
import { prisma } from "@/lib/prisma"

export const SEARCH_MAX_LENGTH = 100

export type SearchUser = {
  id: string
  name: string
  username: string | null
  image: string | null
  bio: string | null
  _count: {
    followers: number
    posts: number
  }
}

export type SearchResults = {
  query: string
  users: SearchUser[]
  posts: FeedPost[]
}

export async function searchContent(
  rawQuery: string,
  viewerId?: string
): Promise<SearchResults> {
  const query = rawQuery.trim().slice(0, SEARCH_MAX_LENGTH)

  if (!query) {
    return { query: "", users: [], posts: [] }
  }

  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        _count: {
          select: {
            followers: true,
            posts: true,
          },
        },
      },
    }),
    prisma.post.findMany({
      where: {
        parentId: null,
        content: { contains: query, mode: "insensitive" },
      },
      take: 20,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: postSelect(viewerId),
    }),
  ])

  return {
    query,
    users,
    posts: posts.map((post) => mapPost(post, viewerId)),
  }
}
