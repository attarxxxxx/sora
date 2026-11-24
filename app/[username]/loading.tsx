import { FeedSkeleton } from "@/components/loading/feed-skeleton"
import { ProfileSkeleton } from "@/components/loading/profile-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="aspect-[3/1] w-full rounded-lg" />
        <ProfileSkeleton />
        <FeedSkeleton rows={2} />
      </div>
    </main>
  )
}
