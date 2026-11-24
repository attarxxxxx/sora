"use server"

import { revalidatePath } from "next/cache"

import { destroyImages, verifyUploadedImage } from "@/lib/cloudinary"
import { MEDIA_FOLDERS, MAX_POST_IMAGES } from "@/lib/media"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

type CreatePostState = {
  status: "idle" | "error" | "success"
  message?: string
}

type ActionResult = {
  ok: boolean
  error?: string
}

type MediaInput = {
  publicId: string
  alt: string
}

function parseMedia(formData: FormData): MediaInput[] | null {
  const raw = String(formData.get("media") ?? "")

  if (!raw) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return null
    }

    return parsed.map((item: unknown) => {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof (item as { publicId?: unknown }).publicId !== "string"
      ) {
        throw new Error("Invalid image payload.")
      }

      const record = item as { publicId: string; alt?: unknown }

      return {
        publicId: record.publicId,
        alt:
          typeof record.alt === "string" ? record.alt.trim().slice(0, 300) : "",
      }
    })
  } catch {
    return null
  }
}

function revalidatePostViews() {
  revalidatePath("/")
  revalidatePath("/[username]", "page")
  revalidatePath("/post/[id]", "page")
}

export async function createPost(
  _previousState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const session = await requireUser()
  const content = String(formData.get("content") ?? "").trim()
  const media = parseMedia(formData)

  if (!content && (!media || media.length === 0)) {
    return {
      status: "error",
      message: "Write something or add an image before posting.",
    }
  }

  if (content.length > 500) {
    return {
      status: "error",
      message: "Posts must be 500 characters or fewer.",
    }
  }

  if (!media) {
    return { status: "error", message: "Invalid image data." }
  }

  if (media.length > MAX_POST_IMAGES) {
    return {
      status: "error",
      message: `You can add up to ${MAX_POST_IMAGES} images per post.`,
    }
  }

  const publicIds = media.map((item) => item.publicId)
  const prefix = `${MEDIA_FOLDERS.post}/${session.user.id}/`

  const verified: {
    publicId: string
    url: string
    width: number | null
    height: number | null
  }[] = []

  for (const publicId of publicIds) {
    const image = await verifyUploadedImage(publicId, prefix)

    if (!image) {
      await destroyImages(publicIds)
      return {
        status: "error",
        message: "One or more images could not be used.",
      }
    }

    verified.push(image)
  }

  try {
    await prisma.post.create({
      data: {
        authorId: session.user.id,
        content,
        images: {
          create: verified.map((image, position) => ({
            publicId: image.publicId,
            url: image.url,
            alt: media[position]?.alt || null,
            width: image.width,
            height: image.height,
            position,
          })),
        },
      },
    })
  } catch (error) {
    console.error("Failed to create post", error)
    await destroyImages(publicIds)
    return { status: "error", message: "Unable to post right now." }
  }

  revalidatePostViews()

  return { status: "success", message: "Your post is live." }
}

export async function deletePostAction(postId: string): Promise<ActionResult> {
  const session = await requireUser()

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })

  if (!post) {
    return { ok: false, error: "Post not found." }
  }

  if (post.authorId !== session.user.id) {
    return { ok: false, error: "You can only delete your own posts." }
  }

  const postIds = [postId]
  const queue = [postId]

  while (queue.length > 0) {
    const currentId = queue.shift() as string
    const children = await prisma.post.findMany({
      where: { parentId: currentId },
      select: { id: true },
    })

    for (const child of children) {
      postIds.push(child.id)
      queue.push(child.id)
    }
  }

  const images = await prisma.postImage.findMany({
    where: { postId: { in: postIds } },
    select: { publicId: true },
  })

  await prisma.post.delete({ where: { id: postId } })
  await destroyImages(images.map((image) => image.publicId))

  revalidatePostViews()

  return { ok: true }
}
