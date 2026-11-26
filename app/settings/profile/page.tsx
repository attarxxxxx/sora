import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "@solar-icons/react/linear/arrow-left"

import { ProfileForm } from "@/components/profile/profile-form"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Update your Sora profile.",
  robots: { index: false, follow: false },
}

export default async function Page() {
  const session = await requireUser()

  const username = (session.user as { username?: string }).username ?? ""

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      bio: true,
      image: true,
      imagePublicId: true,
      coverImage: true,
      coverImagePublicId: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <Button nativeButton={false}
          variant="ghost"
          size="sm"
          className="self-start"
          render={<Link href={`/${username}`} />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to profile
        </Button>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Update your details and images.
          </p>
        </div>

        <ProfileForm user={user} />
      </div>
    </main>
  )
}
