import { prisma } from "@/lib/prisma"

export const FEED_PAGE_SIZE = 10
export const POST_MAX_LENGTH = 500

export type PostAuthor = {
  id: string
  name: string
  username: string | null
  image: string | null
}

export type PostParent = {
  id: string
  content: string
  author: PostAuthor
}

export type FeedPost = {
  id: string
  content: string
  parentId: string | null
  createdAt: Date
  author: PostAuthor
  parent: PostParent | null
  likeCount: number
  replyCount: number
  repostCount: number
  likedByMe: boolean
  repostedByMe: boolean
  bookmarkedByMe: boolean
}

type SelectedPost = {
  id: string
  content: string
  parentId: string | null
  createdAt: Date
  author: PostAuthor
  parent: PostParent | null
  _count: {
    likes: number
    replies: number
    reposts: number
  }
  likes: { id: string }[]
  reposts: { id: string }[]
  bookmarks: { id: string }[]
}

const authorSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
}

function postSelect(viewerId?: string) {
  const viewer = viewerId ?? ""

  return {
    id: true,
    content: true,
    parentId: true,
    createdAt: true,
    author: { select: authorSelect },
    parent: {
      select: {
        id: true,
        content: true,
        author: { select: authorSelect },
      },
    },
    _count: {
      select: {
        likes: true,
        replies: true,
        reposts: true,
      },
    },
    likes: {
      where: { userId: viewer },
      select: { id: true },
      take: 1,
    },
    reposts: {
      where: { userId: viewer },
      select: { id: true },
      take: 1,
    },
    bookmarks: {
      where: { userId: viewer },
      select: { id: true },
      take: 1,
    },
  }
}

function mapPost(post: SelectedPost): FeedPost {
  return {
    id: post.id,
    content: post.content,
    parentId: post.parentId,
    createdAt: post.createdAt,
    author: post.author,
    parent: post.parent,
    likeCount: post._count.likes,
    replyCount: post._count.replies,
    repostCount: post._count.reposts,
    likedByMe: post.likes.length > 0,
    repostedByMe: post.reposts.length > 0,
    bookmarkedByMe: post.bookmarks.length > 0,
  }
}

export async function getFeed({
  cursor,
  limit = FEED_PAGE_SIZE,
  viewerId,
}: {
  cursor?: string
  limit?: number
  viewerId?: string
} = {}) {
  const posts = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where: { parentId: null },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: postSelect(viewerId),
  })

  const hasMore = posts.length > limit
  const visiblePosts = hasMore ? posts.slice(0, limit) : posts

  return {
    posts: visiblePosts.map(mapPost),
    nextCursor: hasMore
      ? (visiblePosts[visiblePosts.length - 1]?.id ?? null)
      : null,
  }
}

export async function getPost(postId: string, viewerId?: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: postSelect(viewerId),
  })

  return post ? mapPost(post) : null
}

export async function getReplies(postId: string, viewerId?: string) {
  const replies = await prisma.post.findMany({
    where: { parentId: postId },
    take: 50,
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: postSelect(viewerId),
  })

  return replies.map(mapPost)
}

export async function getProfile(username: string, viewerId?: string) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
    },
  })

  if (!user) {
    return null
  }

  const [postCount, followerCount, followingCount, follow, posts] =
    await Promise.all([
      prisma.post.count({
        where: { authorId: user.id, parentId: null },
      }),
      prisma.follow.count({ where: { followingId: user.id } }),
      prisma.follow.count({ where: { followerId: user.id } }),
      viewerId
        ? prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: viewerId,
                followingId: user.id,
              },
            },
            select: { id: true },
          })
        : Promise.resolve(null),
      prisma.post.findMany({
        where: { authorId: user.id, parentId: null },
        take: 50,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: postSelect(viewerId),
      }),
    ])

  return {
    user,
    postCount,
    followerCount,
    followingCount,
    isFollowing: Boolean(follow),
    posts: posts.map(mapPost),
  }
}
