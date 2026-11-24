"use server"

import {
  buildPublicId,
  createUploadSignature,
  destroyImages,
  isCloudinaryConfigured,
} from "@/lib/cloudinary"
import { MEDIA_FOLDERS, type MediaKind } from "@/lib/media"
import { requireUser } from "@/lib/session"

type ActionResult = {
  ok: boolean
  error?: string
}

export async function getUploadSignature(kind: MediaKind) {
  if (!isCloudinaryConfigured) {
    throw new Error("Image uploads are not configured.")
  }

  const session = await requireUser()

  return createUploadSignature(buildPublicId(kind, session.user.id))
}

export async function destroyAssetAction(
  publicId: string
): Promise<ActionResult> {
  const session = await requireUser()
  const allowedPrefixes = Object.values(MEDIA_FOLDERS).map(
    (folder) => `${folder}/${session.user.id}/`
  )

  if (!allowedPrefixes.some((prefix) => publicId.startsWith(prefix))) {
    return { ok: false, error: "Invalid image." }
  }

  await destroyImages([publicId])
  return { ok: true }
}
