import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P, Pixelify_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import "./globals.css"

const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-press" })
const pixelify = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel" })

export const metadata: Metadata = {
  title: "KOGRAPH - APPS | Premium App Store",
  description: "Platform premium untuk aplikasi dan layanan digital berkualitas tinggi",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${pressStart.variable} ${pixelify.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lordicon-element@latest/lordicon-element.css" />
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </head>
      <body className="font-pixel antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
