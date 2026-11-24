"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, CloseCircle, Refresh } from "reicon-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-4 py-16">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CloseCircle />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            We could not load this page. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-wrap justify-center gap-2">
          <Button onClick={retry}>
            <Refresh data-icon="inline-start" />
            Try again
          </Button>
          <Button variant="outline" render={<Link href="/" />}>
            <ArrowLeft data-icon="inline-start" />
            Back home
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
