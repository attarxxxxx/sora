"use client"

import * as React from "react"
import { ImagePlus, X } from "reicon-react"

import { destroyAssetAction } from "@/app/actions/upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { MAX_POST_IMAGES, type UploadedMedia } from "@/lib/media"
import { uploadImage } from "@/lib/upload-client"

export function PostMediaPicker({ disabled }: { disabled?: boolean }) {
  const [items, setItems] = React.useState<UploadedMedia[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""

    if (files.length === 0) {
      return
    }

    if (items.length + files.length > MAX_POST_IMAGES) {
      toast.add({
        title: "Too many images",
        description: `You can add up to ${MAX_POST_IMAGES} images per post.`,
        type: "error",
      })
      return
    }

    setIsUploading(true)

    const added: UploadedMedia[] = []

    try {
      for (const file of files) {
        const uploaded = await uploadImage(file, "post")
        added.push(uploaded)
      }

      setItems((current) => [...current, ...added])
    } catch (error) {
      for (const item of added) {
        await destroyAssetAction(item.publicId)
      }

      toast.add({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setIsUploading(false)
    }
  }

  async function remove(publicId: string) {
    setItems((current) => current.filter((item) => item.publicId !== publicId))

    const result = await destroyAssetAction(publicId)

    if (!result.ok) {
      toast.add({
        title: "Could not remove image",
        description: result.error ?? "Please try again.",
        type: "error",
      })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="sr-only"
        onChange={handleFiles}
        disabled={disabled || isUploading || items.length >= MAX_POST_IMAGES}
      />

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading || items.length >= MAX_POST_IMAGES}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus data-icon="inline-start" />
          {isUploading
            ? "Uploading..."
            : `Add images (${items.length}/${MAX_POST_IMAGES})`}
        </Button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={item.publicId}
              className="flex items-start gap-3 rounded-md border p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt=""
                className="size-16 shrink-0 rounded object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Input
                  value={item.alt}
                  onChange={(event) => {
                    const value = event.target.value
                    setItems((current) =>
                      current.map((entry) =>
                        entry.publicId === item.publicId
                          ? { ...entry, alt: value }
                          : entry
                      )
                    )
                  }}
                  placeholder={`Alt text for image ${index + 1}`}
                  aria-label={`Alt text for image ${index + 1}`}
                  maxLength={300}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove image ${index + 1}`}
                disabled={disabled || isUploading}
                onClick={() => remove(item.publicId)}
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        type="hidden"
        name="media"
        value={JSON.stringify(
          items.map(({ publicId, alt }) => ({ publicId, alt }))
        )}
      />
    </div>
  )
}
