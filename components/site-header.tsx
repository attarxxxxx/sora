"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogoutIcon } from "@solar-icons/react/linear/logout"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()
  const isAuthPage = pathname === "/login" || pathname === "/signup"

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
      <div
        className={cn(
          "mx-auto flex h-14 w-full items-center justify-between gap-4 px-4",
          isAuthPage ? "max-w-2xl" : "max-w-7xl"
        )}
      >
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
              <LogoutIcon data-icon="inline-start" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              nativeButton={false}
              variant="ghost"
              size="sm"
              render={<Link href="/login" />}
            >
              Log in
            </Button>
            <Button
              nativeButton={false}
              size="sm"
              render={<Link href="/signup" />}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
