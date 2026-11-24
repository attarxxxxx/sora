"use client"

import * as React from "react"
import { Trash } from "reicon-react"

import { deletePostAction } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = React.useTransition()

  function remove() {
    startTransition(async () => {
      const result = await deletePostAction(postId)

      if (!result.ok) {
        toast.add({
          title: "Could not delete post",
          description: result.error ?? "Please try again.",
          type: "error",
        })
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Delete post"
      disabled={isPending}
      onClick={remove}
    >
      <Trash />
    </Button>
  )
}
