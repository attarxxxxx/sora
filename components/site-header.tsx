"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logout } from "reicon-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

export function SiteHeader() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
        onError: (context) => {
          toast.add({
            title: "Could not sign out",
            description: context.error.message,
            type: "error",
          })
        },
      },
    })
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Sora
        </Link>

        {isPending ? (
          <Skeleton className="size-8 rounded-full" />
        ) : session ? (
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm text-muted-foreground">
              @
              {(session.user as { username?: string }).username ??
                session.user.name}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <Logout data-icon="inline-start" strokeWidth={2} />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button nativeButton={false}
              variant="ghost"
              size="sm"
              render={<Link href="/login" />}
            >
              Log in
            </Button>
            <Button nativeButton={false} size="sm" render={<Link href="/signup" />}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
