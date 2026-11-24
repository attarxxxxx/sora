import { getUploadSignature } from "@/app/actions/upload"
import {
  isAllowedImageType,
  MAX_IMAGE_BYTES,
  type MediaKind,
  type UploadedMedia,
} from "@/lib/media"

export async function uploadImage(
  file: File,
  kind: MediaKind
): Promise<UploadedMedia> {
  if (!isAllowedImageType(file.type)) {
    throw new Error("Use a JPG, PNG, WebP, or GIF image.")
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be 5 MB or smaller.")
  }

  const signature = await getUploadSignature(kind)

  const body = new FormData()
  body.append("file", file)
  body.append("api_key", signature.apiKey)
  body.append("timestamp", String(signature.timestamp))
  body.append("public_id", signature.publicId)
  body.append("signature", signature.signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body }
  )

  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as {
      error?: { message?: string }
    } | null
    throw new Error(
      detail?.error?.message ?? "Upload failed. Please try again."
    )
  }

  const result = (await response.json()) as {
    public_id: string
    secure_url: string
    width?: number
    height?: number
  }

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: typeof result.width === "number" ? result.width : null,
    height: typeof result.height === "number" ? result.height : null,
    alt: "",
  }
}
