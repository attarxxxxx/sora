import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { AppShell } from "@/components/app-shell"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const intern = localFont({
  src: "./fonts/intern.woff2",
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sora",
  description:
    "A minimalist social space for sharing thoughts, images, and conversations.",
  applicationName: "Sora",
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
