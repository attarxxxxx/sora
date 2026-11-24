"use server"

import { revalidatePath } from "next/cache"

import { destroyImages, verifyUploadedImage } from "@/lib/cloudinary"
import { MEDIA_FOLDERS } from "@/lib/media"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

type ActionResult = {
  ok: boolean
  error?: string
}

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await requireUser()
  const userId = session.user.id

  const name = String(formData.get("name") ?? "").trim()
  const bio = String(formData.get("bio") ?? "").trim()
  const avatarPublicId = String(formData.get("avatarPublicId") ?? "")
  const coverPublicId = String(formData.get("coverImagePublicId") ?? "")
  const removeAvatar = formData.get("removeAvatar") === "1"
  const removeCover = formData.get("removeCover") === "1"

  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      image: true,
      imagePublicId: true,
      coverImage: true,
      coverImagePublicId: true,
    },
  })

  if (!current) {
    return { ok: false, error: "Account not found." }
  }

  const uploaded = [
    avatarPublicId !== current.imagePublicId ? avatarPublicId : "",
    coverPublicId !== current.coverImagePublicId ? coverPublicId : "",
  ].filter(Boolean)

  async function fail(error: string): Promise<ActionResult> {
    await destroyImages(uploaded)
    return { ok: false, error }
  }

  if (!name || name.length > 50) {
    return fail("Display name must be between 1 and 50 characters.")
  }

  if (bio.length > 160) {
    return fail("Bio must be 160 characters or fewer.")
  }

  let image = current.image
  let imagePublicId = current.imagePublicId
  let coverImage = current.coverImage
  let coverImagePublicId = current.coverImagePublicId
  const stale: string[] = []

  if (removeAvatar) {
    if (current.imagePublicId) {
      stale.push(current.imagePublicId)
    }
    image = null
    imagePublicId = null
  } else if (avatarPublicId && avatarPublicId !== current.imagePublicId) {
    const verified = await verifyUploadedImage(
      avatarPublicId,
      `${MEDIA_FOLDERS.avatar}/${userId}/`
    )

    if (!verified) {
      return fail("The new avatar could not be used.")
    }

    if (current.imagePublicId) {
      stale.push(current.imagePublicId)
    }

    image = verified.url
    imagePublicId = verified.publicId
  }

  if (removeCover) {
    if (current.coverImagePublicId) {
      stale.push(current.coverImagePublicId)
    }
    coverImage = null
    coverImagePublicId = null
  } else if (coverPublicId && coverPublicId !== current.coverImagePublicId) {
    const verified = await verifyUploadedImage(
      coverPublicId,
      `${MEDIA_FOLDERS.cover}/${userId}/`
    )

    if (!verified) {
      return fail("The new cover image could not be used.")
    }

    if (current.coverImagePublicId) {
      stale.push(current.coverImagePublicId)
    }

    coverImage = verified.url
    coverImagePublicId = verified.publicId
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio: bio || null,
        image,
        imagePublicId,
        coverImage,
        coverImagePublicId,
      },
    })
  } catch (error) {
    console.error("Failed to update profile", error)
    await destroyImages(uploaded)
    return { ok: false, error: "Unable to save your profile right now." }
  }

  await destroyImages(stale)

  revalidatePath("/")
  revalidatePath("/[username]", "page")
  revalidatePath("/settings/profile")

  return { ok: true }
}
