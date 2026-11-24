export const MEDIA_FOLDERS = {
  post: "sora/posts",
  avatar: "sora/avatars",
  cover: "sora/covers",
} as const

export type MediaKind = keyof typeof MEDIA_FOLDERS

export const MAX_POST_IMAGES = 4
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const

export const ALLOWED_IMAGE_FORMATS: readonly string[] = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
]

export function isAllowedImageType(type: string) {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)
}

export type UploadedMedia = {
  publicId: string
  url: string
  width: number | null
  height: number | null
  alt: string
}
