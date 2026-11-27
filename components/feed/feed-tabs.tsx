import type { ReactNode } from "react"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FeedTab } from "@/lib/posts"

const feedTabs: { value: FeedTab; label: string; href: string }[] = [
  { value: "for-you", label: "For you", href: "/" },
  { value: "following", label: "Following", href: "/?tab=following" },
]

export function FeedTabs({
  activeTab,
  children,
}: {
  activeTab: FeedTab
  children: ReactNode
}) {
  return (
    <Tabs value={activeTab} className="gap-4">
      <TabsList
        variant="line"
        aria-label="Feed tabs"
        className="w-full gap-0 rounded-none border-b"
      >
        {feedTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            nativeButton={false}
            render={<Link href={tab.href} />}
            className="flex-1 rounded-none px-2 py-2"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeTab}>{children}</TabsContent>
    </Tabs>
  )
}
