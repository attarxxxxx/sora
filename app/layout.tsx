import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { AppShell } from "@/components/app-shell"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

const intern = localFont({
  src: "./fonts/intern.woff2",
  variable: "--font-sans",
  display: "swap",
})

const description =
  "A minimalist social space for sharing thoughts, images, and conversations."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sora",
    template: "%s · Sora",
  },
  description,
  applicationName: "Sora",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Sora",
    locale: "en_US",
    url: "/",
    title: "Sora",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sora",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans antialiased", intern.variable)}
    >
      <body className="flex min-h-svh flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Toaster>
            <SiteHeader />
            <AppShell>{children}</AppShell>
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  )
}
