"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, PenSquare, Search, User } from "reicon-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type NavItem = {
  label: string
  href: string
  icon: ReactNode
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const username = (session?.user as { username?: string } | undefined)
    ?.username
  const profileHref = username ? `/${username}` : "/login"
  const composeHref = session ? "/#compose" : "/login"

  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>
  }

  const desktopItems: (NavItem & { disabled?: boolean })[] = [
    { label: "Home", href: "/", icon: <Home data-icon="inline-start" /> },
    {
      label: "Search",
      href: "#",
      icon: <Search data-icon="inline-start" />,
      disabled: true,
    },
    {
      label: "Notifications",
      href: "#",
      icon: <Bell data-icon="inline-start" />,
      disabled: true,
    },
    {
      label: "Profile",
      href: profileHref,
      icon: <User data-icon="inline-start" />,
    },
  ]

  const mobileItems: (NavItem & { disabled?: boolean })[] = [
    { label: "Home", href: "/", icon: <Home data-icon="inline-start" /> },
    {
      label: "Search",
      href: "#",
      icon: <Search data-icon="inline-start" />,
      disabled: true,
    },
    {
      label: "New post",
      href: composeHref,
      icon: <PenSquare data-icon="inline-start" />,
    },
    {
      label: "Notifications",
      href: "#",
      icon: <Bell data-icon="inline-start" />,
      disabled: true,
    },
    {
      label: "Profile",
      href: profileHref,
      icon: <User data-icon="inline-start" />,
    },
  ]

  function isActive(item: NavItem) {
    if (item.href === "/") {
      return pathname === "/"
    }

    if (item.label === "Profile" && username) {
      return pathname === item.href
    }

    return false
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 flex-col gap-6 border-r px-3 py-6 md:flex">
          <nav className="flex flex-col gap-1" aria-label="Main navigation">
            {desktopItems.map((item) =>
              item.disabled ? (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="justify-start"
                  disabled
                >
                  {item.icon}
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={item.label}
                  variant={isActive(item) ? "secondary" : "ghost"}
                  className="justify-start"
                  aria-current={isActive(item) ? "page" : undefined}
                  render={<Link href={item.href} />}
                >
                  {item.icon}
                  {item.label}
                </Button>
              )
            )}
          </nav>

          <Button render={<Link href={composeHref} />}>
            <PenSquare data-icon="inline-start" />
            New post
          </Button>
        </aside>

        <div className="min-w-0 flex-1 pb-20 md:pb-0">{children}</div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-around border-t bg-background px-2 md:hidden"
        aria-label="Mobile navigation"
      >
        {mobileItems.map((item) =>
          item.disabled ? (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              aria-label={item.label}
              disabled
            >
              {item.icon}
            </Button>
          ) : (
            <Button
              key={item.label}
              variant={isActive(item) ? "secondary" : "ghost"}
              size="icon"
              aria-label={item.label}
              aria-current={isActive(item) ? "page" : undefined}
              render={<Link href={item.href} />}
            >
              {item.icon}
            </Button>
          )
        )}
      </nav>
    </>
  )
}
