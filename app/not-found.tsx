import Link from "next/link"
import { ArrowLeftIcon } from "@solar-icons/react/linear/arrow-left"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-4 py-16">
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            This profile does not exist, or the page moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/" />}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back home
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
