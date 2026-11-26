"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon } from "@solar-icons/react/linear/bell"
import { HomeIcon } from "@solar-icons/react/linear/home"
import { PenNewSquareIcon } from "@solar-icons/react/linear/pen-new-square"
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier"
import { UserIcon } from "@solar-icons/react/linear/user"

import { NotificationBadge } from "@/components/notification/notification-badge"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type NavItem = {
  label: string
  href: string
  icon: ReactNode
}

export function AppShell({
  children,
  rightSidebar,
}: {
  children: ReactNode
  rightSidebar?: ReactNode
}) {
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
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon data-icon="inline-start" />,
    },
    {
      label: "Search",
      href: "/search",
      icon: <MagnifierIcon data-icon="inline-start" />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <BellIcon data-icon="inline-start" />,
    },
    {
      label: "Profile",
      href: profileHref,
      icon: <UserIcon data-icon="inline-start" />,
    },
  ]

  const mobileItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon data-icon="inline-start" />,
    },
    {
      label: "Search",
      href: "/search",
      icon: <MagnifierIcon data-icon="inline-start" />,
    },
    {
      label: "New post",
      href: composeHref,
      icon: <PenNewSquareIcon data-icon="inline-start" />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <BellIcon data-icon="inline-start" />,
    },
    {
      label: "Profile",
      href: profileHref,
      icon: <UserIcon data-icon="inline-start" />,
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
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 md:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)_18rem]">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] flex-col gap-6 border-r px-3 py-6 md:flex">
          <nav className="flex flex-col gap-1" aria-label="Main navigation">
            {desktopItems.map((item) => (
              <Button
                nativeButton={false}
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

          <Button nativeButton={false} render={<Link href={composeHref} />}>
            <PenNewSquareIcon data-icon="inline-start" />
            New post
          </Button>
        </aside>

        <div id="main-content" className="min-w-0 pb-20 md:pb-0">
          {children}
        </div>

        {rightSidebar && (
          <aside
            className="sticky top-14 hidden h-[calc(100svh-3.5rem)] border-l px-4 py-6 lg:block"
            aria-label="Discover"
          >
            {rightSidebar}
          </aside>
        )}
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-around border-t bg-background px-2 md:hidden"
        aria-label="Mobile navigation"
      >
        {mobileItems.map((item) => (
          <Button
            nativeButton={false}
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
