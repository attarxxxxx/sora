"use client"

import * as React from "react"
import { Send } from "reicon-react"

import { createPost } from "@/app/actions/post"
import { PostMediaPicker } from "@/components/media/post-media-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

const MAX_POST_LENGTH = 500

export function PostComposer() {
  const [isPending, startTransition] = React.useTransition()
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [generation, setGeneration] = React.useState(0)
  const formRef = React.useRef<HTMLFormElement>(null)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    setError(null)

    startTransition(async () => {
      const result = await createPost({ status: "idle" }, formData)

      if (result.status === "error") {
        setError(result.message ?? "Unable to post right now.")
        return
      }

      setValue("")
      formRef.current?.reset()
      setGeneration((current) => current + 1)
      toast.add({
        title: "Posted",
        description: result.message ?? "Your post is live.",
        type: "success",
      })
    })
  }

  return (
    <Card id="compose" size="sm">
      <CardHeader>
        <CardTitle>New post</CardTitle>
        <CardDescription>
          Share a thought with everyone on Sora.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={Boolean(error) || undefined} className="gap-2">
              <FieldLabel htmlFor="post-content" className="sr-only">
                Your post
              </FieldLabel>
              <Textarea
                id="post-content"
                name="content"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="What's on your mind?"
                maxLength={MAX_POST_LENGTH}
                aria-invalid={Boolean(error)}
                autoFocus
              />
              <FieldDescription className="self-end">
                {value.length}/{MAX_POST_LENGTH}
              </FieldDescription>
              <FieldError>{error}</FieldError>
            </Field>
          </FieldGroup>

          <PostMediaPicker key={generation} disabled={isPending} />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Posting..." : "Post"}
              <Send data-icon="inline-end" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
