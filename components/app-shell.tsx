"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, PenSquare, Search, User } from "reicon-react"

import { NotificationBadge } from "@/components/notification/notification-badge"
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

  const desktopItems: NavItem[] = [
    { label: "Home", href: "/", icon: <Home data-icon="inline-start" /> },
    {
      label: "Search",
      href: "/search",
      icon: <Search data-icon="inline-start" />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Bell data-icon="inline-start" />,
    },
    {
      label: "Profile",
      href: profileHref,
      icon: <User data-icon="inline-start" />,
    },
  ]

  const mobileItems: NavItem[] = [
    { label: "Home", href: "/", icon: <Home data-icon="inline-start" /> },
    {
      label: "Search",
      href: "/search",
      icon: <Search data-icon="inline-start" />,
    },
    {
      label: "New post",
      href: composeHref,
      icon: <PenSquare data-icon="inline-start" />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Bell data-icon="inline-start" />,
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

    if (item.label === "New post") {
      return false
    }

    return pathname.startsWith(item.href)
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 flex-col gap-6 border-r px-3 py-6 md:flex">
          <nav className="flex flex-col gap-1" aria-label="Main navigation">
            {desktopItems.map((item) => (
              <Button
                key={item.label}
                variant={isActive(item) ? "secondary" : "ghost"}
                className="justify-start"
                aria-current={isActive(item) ? "page" : undefined}
                render={<Link href={item.href} />}
              >
                {item.icon}
                {item.label}
                {item.label === "Notifications" && <NotificationBadge />}
              </Button>
            ))}
          </nav>

          <Button render={<Link href={composeHref} />}>
            <PenSquare data-icon="inline-start" />
            New post
          </Button>
        </aside>

        <div id="main-content" className="min-w-0 flex-1 pb-20 md:pb-0">
          {children}
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-around border-t bg-background px-2 md:hidden"
        aria-label="Mobile navigation"
      >
        {mobileItems.map((item) => (
          <Button
            key={item.label}
            variant={isActive(item) ? "secondary" : "ghost"}
            size="icon"
            aria-label={item.label}
            aria-current={isActive(item) ? "page" : undefined}
            render={<Link href={item.href} />}
          >
            <span className="relative flex">
              {item.icon}
              {item.label === "Notifications" && (
                <NotificationBadge className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1" />
              )}
            </span>
          </Button>
        ))}
      </nav>
    </>
  )
}
