"use server"

import { revalidatePath } from "next/cache"

import { POST_MAX_LENGTH } from "@/lib/posts"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

type ActionResult = {
  ok: boolean
  error?: string
}

function revalidateSocialPaths() {
  revalidatePath("/")
  revalidatePath("/[username]", "page")
  revalidatePath("/post/[id]", "page")
}

async function getPost(postId: string) {
  return prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  })
}

export async function toggleLikeAction(postId: string): Promise<ActionResult> {
  const session = await requireUser()
  const post = await getPost(postId)

  if (!post) {
    return { ok: false, error: "Post not found." }
  }

  const deleted = await prisma.like.deleteMany({
    where: { userId: session.user.id, postId },
  })

  if (deleted.count === 0) {
    await prisma.like.create({
      data: { userId: session.user.id, postId },
    })
  }

  revalidateSocialPaths()
  return { ok: true }
}

export async function toggleRepostAction(
  postId: string
): Promise<ActionResult> {
  const session = await requireUser()
  const post = await getPost(postId)

  if (!post) {
    return { ok: false, error: "Post not found." }
  }

  const deleted = await prisma.repost.deleteMany({
    where: { userId: session.user.id, postId },
  })

  if (deleted.count === 0) {
    await prisma.repost.create({
      data: { userId: session.user.id, postId },
    })
  }

  revalidateSocialPaths()
  return { ok: true }
}

export async function toggleBookmarkAction(
  postId: string
): Promise<ActionResult> {
  const session = await requireUser()
  const post = await getPost(postId)

  if (!post) {
    return { ok: false, error: "Post not found." }
  }

  const deleted = await prisma.bookmark.deleteMany({
    where: { userId: session.user.id, postId },
  })

  if (deleted.count === 0) {
    await prisma.bookmark.create({
      data: { userId: session.user.id, postId },
    })
  }

  revalidateSocialPaths()
  return { ok: true }
}

export async function createReplyAction(
  parentId: string,
  rawContent: string
): Promise<ActionResult> {
  const session = await requireUser()
  const content = rawContent.trim()

  if (!content) {
    return { ok: false, error: "Write a reply before posting." }
  }

  if (content.length > POST_MAX_LENGTH) {
    return {
      ok: false,
      error: `Replies must be ${POST_MAX_LENGTH} characters or fewer.`,
    }
  }

  const parent = await getPost(parentId)

  if (!parent) {
    return { ok: false, error: "Post not found." }
  }

  await prisma.post.create({
    data: {
      authorId: session.user.id,
      content,
      parentId,
    },
  })

  revalidateSocialPaths()
  return { ok: true }
}

export async function toggleFollowAction(
  userId: string
): Promise<ActionResult> {
  const session = await requireUser()

  if (userId === session.user.id) {
    return { ok: false, error: "You cannot follow yourself." }
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })

  if (!target) {
    return { ok: false, error: "User not found." }
  }

  const deleted = await prisma.follow.deleteMany({
    where: {
      followerId: session.user.id,
      followingId: userId,
    },
  })

  if (deleted.count === 0) {
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: userId,
      },
    })
  }

  revalidatePath("/[username]", "page")
  return { ok: true }
}
