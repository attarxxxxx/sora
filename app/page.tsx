import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Home</CardTitle>
          <CardDescription>
            Your feed will appear here. Anyone can browse it; log in to join the
            conversation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Posts, replies, and follows are coming in the next phase.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
