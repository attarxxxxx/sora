import type { Metadata } from "next"
import { Fragment } from "react"
import { Search } from "reicon-react"

import { PostCard } from "@/components/post/post-card"
import { UserResultCard } from "@/components/search/user-result-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/session"
import { SEARCH_MAX_LENGTH, searchContent } from "@/lib/search"

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[]
  }>
}

function readQuery(value: string | string[] | undefined) {
  return typeof value === "string"
    ? value.trim().slice(0, SEARCH_MAX_LENGTH)
    : ""
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = readQuery((await searchParams).q)

  return {
    title: query ? `Search: ${query}` : "Search",
    description: query
      ? `People and posts matching "${query}" on Sora.`
      : "Search for people and posts on Sora.",
    alternates: { canonical: "/search" },
  }
}

export default async function Page({ searchParams }: SearchPageProps) {
  const query = readQuery((await searchParams).q)
  const session = await getSession()
  const results = await searchContent(query, session?.user.id)
  const isSignedIn = Boolean(session)
  const hasResults = results.users.length > 0 || results.posts.length > 0

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
          <p className="text-sm text-muted-foreground">
            Find people and posts on Sora.
          </p>
        </div>

        <form action="/search" method="get" className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="search-query">Search Sora</FieldLabel>
              <Input
                id="search-query"
                name="q"
                defaultValue={query}
                placeholder="Name, username, or keyword"
                maxLength={SEARCH_MAX_LENGTH}
                autoFocus
              />
              <FieldDescription>
                Search people by name or username, and posts by their text.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <Button type="submit">
            <Search data-icon="inline-start" strokeWidth={2} />
            Search
          </Button>
        </form>

        {!query ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>What are you looking for?</EmptyTitle>
              <EmptyDescription>
                Enter a name, username, or keyword to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : !hasResults ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>No results for “{query}”</EmptyTitle>
              <EmptyDescription>
                Try a different name, username, or keyword.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-6">
            <section aria-label="People">
              <h2 className="px-1 pb-2 text-sm font-medium">People</h2>
              <Card size="sm" className="py-0">
                <CardContent className="px-0">
                  {results.users.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-muted-foreground">
                      No people matched your search.
                    </p>
                  ) : (
                    <div className="flex flex-col">
                      {results.users.map((user, index) => (
                        <Fragment key={user.id}>
                          {index > 0 && <Separator />}
                          <UserResultCard user={user} />
                        </Fragment>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section aria-label="Posts">
              <h2 className="px-1 pb-2 text-sm font-medium">Posts</h2>
              <Card size="sm" className="py-0">
                <CardContent className="px-0">
                  {results.posts.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-muted-foreground">
                      No posts matched your search.
                    </p>
                  ) : (
                    <div className="flex flex-col">
                      {results.posts.map((post, index) => (
                        <Fragment key={post.id}>
                          {index > 0 && <Separator />}
                          <PostCard post={post} isSignedIn={isSignedIn} />
                        </Fragment>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
