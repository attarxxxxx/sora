import { v2 as cloudinary } from "cloudinary"

import {
  ALLOWED_IMAGE_FORMATS,
  MAX_IMAGE_BYTES,
  MEDIA_FOLDERS,
  type MediaKind,
} from "@/lib/media"

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret)

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export function buildPublicId(kind: MediaKind, userId: string) {
  return `${MEDIA_FOLDERS[kind]}/${userId}/${crypto.randomUUID()}`
}

export function createUploadSignature(publicId: string) {
  if (!isCloudinaryConfigured || !cloudName || !apiKey || !apiSecret) {
    throw new Error("Image uploads are not configured.")
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, public_id: publicId },
    apiSecret
  )

  return { cloudName, apiKey, timestamp, publicId, signature }
}

export type VerifiedImage = {
  publicId: string
  url: string
  width: number | null
  height: number | null
}

export async function verifyUploadedImage(
  publicId: string,
  prefix: string
): Promise<VerifiedImage | null> {
  if (!isCloudinaryConfigured) {
    throw new Error("Image uploads are not configured.")
  }

  if (!publicId.startsWith(prefix)) {
    return null
  }

  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    })

    if (
      !ALLOWED_IMAGE_FORMATS.includes(String(resource.format).toLowerCase())
    ) {
      return null
    }

    if (
      typeof resource.bytes === "number" &&
      resource.bytes > MAX_IMAGE_BYTES
    ) {
      return null
    }

    return {
      publicId,
      url: cloudinary.url(publicId, {
        secure: true,
        resource_type: "image",
        transformation: [
          { width: 1400, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      }),
      width: typeof resource.width === "number" ? resource.width : null,
      height: typeof resource.height === "number" ? resource.height : null,
    }
  } catch {
    return null
  }
}

export async function destroyImages(publicIds: string[]) {
  if (!isCloudinaryConfigured || publicIds.length === 0) {
    return
  }

  try {
    await cloudinary.api.delete_resources(publicIds, {
      resource_type: "image",
    })
  } catch (error) {
    console.error("Failed to delete Cloudinary assets", error)
  }
}
