"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

type CreatePostState = {
  status: "idle" | "error" | "success"
  message?: string
}

export async function createPost(
  _previousState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const session = await requireUser()
  const content = String(formData.get("content") ?? "").trim()

  if (!content) {
    return { status: "error", message: "Write something before posting." }
  }

  if (content.length > 500) {
    return {
      status: "error",
      message: "Posts must be 500 characters or fewer.",
    }
  }

  await prisma.post.create({
    data: {
      authorId: session.user.id,
      content,
    },
  })

  revalidatePath("/")
  revalidatePath("/[username]", "page")

  return { status: "success", message: "Your post is live." }
}
