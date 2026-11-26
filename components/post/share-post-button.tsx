"use client"

import { Share } from "reicon-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { getSiteUrl } from "@/lib/site"

function copyWithFallback(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand("copy")
  textarea.remove()
  return copied
}

export function SharePostButton({ postId }: { postId: string }) {
  async function copyLink() {
    const url = getSiteUrl(`/post/${postId}`)

    try {
      let copied = false

      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url)
          copied = true
        } catch {
          copied = copyWithFallback(url)
        }
      } else {
        copied = copyWithFallback(url)
      }

      if (!copied) {
        throw new Error("Copy was not allowed.")
      }

      toast.add({ title: "Link copied to clipboard" })
    } catch {
      toast.add({
        title: "Could not copy link",
        description: "Please try again.",
        type: "error",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Share post"
      onClick={copyLink}
    >
      <Share data-icon="inline-start" strokeWidth={2} />
    </Button>
  )
}
