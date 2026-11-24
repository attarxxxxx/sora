import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
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
      className={cn("antialiased font-sans", intern.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
