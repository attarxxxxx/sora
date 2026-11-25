"use client"

import * as React from "react"
import { Camera, X } from "reicon-react"

import { destroyAssetAction } from "@/app/actions/upload"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import type { MediaKind } from "@/lib/media"
import { uploadImage } from "@/lib/upload-client"

export function ProfileImageField({
  kind,
  name,
  currentUrl,
  currentPublicId,
  disabled,
}: {
  kind: Extract<MediaKind, "avatar" | "cover">
  name: string
  currentUrl: string | null
  currentPublicId: string | null
  disabled?: boolean
}) {
  const [publicId, setPublicId] = React.useState(currentPublicId ?? "")
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(currentUrl)
  const [removed, setRemoved] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isAvatar = kind === "avatar"
  const removeFieldName = isAvatar ? "removeAvatar" : "removeCover"

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    setIsUploading(true)

    try {
      const uploaded = await uploadImage(file, kind)

      if (publicId && publicId !== currentPublicId) {
        await destroyAssetAction(publicId)
      }

      setPublicId(uploaded.publicId)
      setPreviewUrl(uploaded.url)
      setRemoved(false)
    } catch (error) {
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

  async function remove() {
    if (publicId && publicId !== currentPublicId) {
      await destroyAssetAction(publicId)
    }

    setPublicId("")
    setPreviewUrl(null)
    setRemoved(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={
          isAvatar
            ? "flex items-center gap-4"
            : "relative aspect-[3/1] w-full overflow-hidden rounded-lg border bg-muted"
        }
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={isAvatar ? "Avatar preview" : "Cover preview"}
            className={
              isAvatar
                ? "size-20 rounded-full object-cover"
                : "size-full object-cover"
            }
          />
        ) : (
          <div
            className={
              isAvatar
                ? "flex size-20 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground"
                : "flex size-full items-center justify-center text-sm text-muted-foreground"
            }
          >
            No {isAvatar ? "avatar" : "cover"}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFiles}
        disabled={disabled || isUploading}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Camera data-icon="inline-start" strokeWidth={2} />
          {isUploading ? "Uploading..." : previewUrl ? "Change" : "Upload"}
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || isUploading}
            onClick={remove}
          >
            <X data-icon="inline-start" strokeWidth={2} />
            Remove
          </Button>
        )}
      </div>

      <input type="hidden" name={name} value={removed ? "" : publicId} />
      {removed && <input type="hidden" name={removeFieldName} value="1" />}
    </div>
  )
}
