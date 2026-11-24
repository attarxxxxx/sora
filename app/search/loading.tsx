import { FeedSkeleton } from "@/components/loading/feed-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <FeedSkeleton rows={2} />
      </div>
    </main>
  )
}
