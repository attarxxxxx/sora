"use client"

import * as React from "react"

import { updateProfileAction } from "@/app/actions/profile"
import { ProfileImageField } from "@/components/media/profile-image-field"
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

type ProfileFormUser = {
  name: string
  bio: string | null
  image: string | null
  imagePublicId: string | null
  coverImage: string | null
  coverImagePublicId: string | null
}

export function ProfileForm({ user }: { user: ProfileFormUser }) {
  const [isPending, startTransition] = React.useTransition()
  const [name, setName] = React.useState(user.name)
  const [bio, setBio] = React.useState(user.bio ?? "")

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await updateProfileAction(formData)

      if (!result.ok) {
        toast.add({
          title: "Could not save profile",
          description: result.error ?? "Please try again.",
          type: "error",
        })
        return
      }

      toast.add({
        title: "Profile updated",
        description: "Your changes are now live.",
        type: "success",
      })
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>
            This information appears on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="profile-name">Display name</FieldLabel>
              <Input
                id="profile-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={50}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
              <Textarea
                id="profile-bio"
                name="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="A short introduction"
                maxLength={160}
                rows={3}
              />
              <FieldDescription className="self-end">
                {bio.length}/160
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Shown next to your posts and replies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileImageField
            kind="avatar"
            name="avatarPublicId"
            currentUrl={user.image}
            currentPublicId={user.imagePublicId}
            disabled={isPending}
          />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Cover image</CardTitle>
          <CardDescription>Shown at the top of your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileImageField
            kind="cover"
            name="coverImagePublicId"
            currentUrl={user.coverImage}
            currentPublicId={user.coverImagePublicId}
            disabled={isPending}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  )
}
