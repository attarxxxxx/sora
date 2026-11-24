import Image from "next/image"

import type { PostMediaItem } from "@/lib/posts"
import { cn } from "@/lib/utils"

export function PostMedia({
  images,
  authorName,
}: {
  images: PostMediaItem[]
  authorName: string
}) {
  if (images.length === 0) {
    return null
  }

  function altText(image: PostMediaItem) {
    return image.alt?.trim() || `Image shared by ${authorName}`
  }

  if (images.length === 1) {
    const image = images[0] as PostMediaItem

    return (
      <div className="mt-3 overflow-hidden rounded-lg border">
        {image.width && image.height ? (
          <Image
            src={image.url}
            alt={altText(image)}
            width={image.width}
            height={image.height}
            sizes="(max-width: 640px) 100vw, 640px"
            className="h-auto w-full object-cover"
          />
        ) : (
          <div className="relative aspect-video">
            <Image
              src={image.url}
              alt={altText(image)}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-lg border">
      {images.slice(0, 4).map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "relative aspect-square",
            images.length === 3 && index === 0 && "col-span-2 aspect-video"
          )}
        >
          <Image
            src={image.url}
            alt={altText(image)}
            fill
            sizes="(max-width: 640px) 50vw, 320px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
