"use client"

import * as React from "react"

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          backgroundColor: "#fafafa",
          color: "#171717",
        }}
      >
        <div
          style={{ maxWidth: "28rem", padding: "2rem", textAlign: "center" }}
        >
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#525252" }}>
            Sora could not load. Please try again.
          </p>
          <button
            onClick={retry}
            style={{
              cursor: "pointer",
              border: 0,
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#171717",
              color: "#fff",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
