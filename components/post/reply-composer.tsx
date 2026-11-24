"use client"

import * as React from "react"
import { Send } from "reicon-react"

import { createReplyAction } from "@/app/actions/interactions"
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
import { notifyNotificationsChanged } from "@/lib/notification-events"

const MAX_REPLY_LENGTH = 500

export function ReplyComposer({ parentId }: { parentId: string }) {
  const [isPending, startTransition] = React.useTransition()
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    setError(null)

    startTransition(async () => {
      const result = await createReplyAction(
        parentId,
        String(formData.get("content") ?? "")
      )

      if (!result.ok) {
        setError(result.error ?? "Unable to reply right now.")
        return
      }

      setValue("")
      formRef.current?.reset()
      notifyNotificationsChanged()
      toast.add({
        title: "Reply posted",
        description: "Your reply is now in the thread.",
        type: "success",
      })
    })
  }

  return (
    <Card id="reply" size="sm">
      <CardHeader>
        <CardTitle>Reply</CardTitle>
        <CardDescription>Add your voice to this thread.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={Boolean(error) || undefined} className="gap-2">
              <FieldLabel htmlFor="reply-content" className="sr-only">
                Your reply
              </FieldLabel>
              <Textarea
                id="reply-content"
                name="content"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Write a reply..."
                maxLength={MAX_REPLY_LENGTH}
                aria-invalid={Boolean(error)}
                required
              />
              <FieldDescription className="self-end">
                {value.length}/{MAX_REPLY_LENGTH}
              </FieldDescription>
              <FieldError>{error}</FieldError>
            </Field>
          </FieldGroup>

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Replying..." : "Reply"}
              <Send data-icon="inline-end" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
