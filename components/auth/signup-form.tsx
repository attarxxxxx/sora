"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRightIcon } from "@solar-icons/react/linear/arrow-right"

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

export function SignupForm() {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })

  React.useEffect(() => {
    if (!isSessionPending && session) {
      router.replace("/")
    }
  }, [isSessionPending, session, router])

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    const result = await authClient.signUp.email({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      callbackURL: "/",
    })

    setIsPending(false)

    if (result.error) {
      setError(result.error.message ?? "Unable to create your account.")
      return
    }

    toast.add({
      title: "Welcome to Sora",
      description: "Your account is ready.",
      type: "success",
    })
    router.push("/")
    router.refresh()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Display name</FieldLabel>
          <Input
            id="name"
            value={form.name}
            onChange={update("name")}
            placeholder="Alex Morgan"
            autoComplete="name"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            value={form.username}
            onChange={update("username")}
            placeholder="alexmorgan"
            pattern="[a-zA-Z0-9_.]{3,30}"
            minLength={3}
            maxLength={30}
            autoComplete="username"
            required
          />
          <FieldDescription>
            Letters, numbers, dots, and underscores. 3–30 characters.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="alex@example.com"
            autoComplete="email"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="At least 8 characters"
            minLength={8}
            autoComplete="new-password"
            required
          />
        </Field>

        <FieldError>{error}</FieldError>
      </FieldGroup>

      <Button type="submit" size="lg" disabled={isPending || isSessionPending}>
        {isPending ? "Creating account..." : "Create account"}
        <ArrowRightIcon data-icon="inline-end" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </form>
  )
}
