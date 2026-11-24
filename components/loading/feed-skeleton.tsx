import { Fragment } from "react"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function FeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: rows }).map((_, index) => (
        <Fragment key={index}>
          {index > 0 && <Separator />}
          <div className="flex gap-3 px-4 py-5">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-14" />
                <Skeleton className="h-7 w-14" />
                <Skeleton className="h-7 w-14" />
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
