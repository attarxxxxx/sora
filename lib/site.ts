export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000"

export function getSiteUrl(path = "/") {
  return new URL(path, SITE_URL).toString()
}
