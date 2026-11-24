"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "reicon-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

export function LoginForm() {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [identifier, setIdentifier] = React.useState("")
  const [password, setPassword] = React.useState("")

  React.useEffect(() => {
    if (!isSessionPending && session) {
      router.replace("/")
    }
  }, [isSessionPending, session, router])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    const isEmail = identifier.includes("@")
    const result = isEmail
      ? await authClient.signIn.email({
          email: identifier.trim(),
          password,
          callbackURL: "/",
        })
      : await authClient.signIn.username({
          username: identifier.trim(),
          password,
          callbackURL: "/",
        })

    setIsPending(false)

    if (result.error) {
      setError(result.error.message ?? "Unable to log in.")
      return
    }

    toast.add({
      title: "Welcome back",
      description: "You are now signed in.",
      type: "success",
    })
    router.push("/")
    router.refresh()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="identifier">Email or username</FieldLabel>
          <Input
            id="identifier"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="alex@example.com or alexmorgan"
            autoComplete="username"
            required
          />
          <FieldDescription>
            Use the email or username you signed up with.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>

        <FieldError>{error}</FieldError>
      </FieldGroup>

      <Button type="submit" size="lg" disabled={isPending || isSessionPending}>
        {isPending ? "Logging in..." : "Log in"}
        <ArrowRight data-icon="inline-end" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to Sora?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}
