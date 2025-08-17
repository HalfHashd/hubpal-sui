"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Link from "next/link"
import "./globals.css"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* <CHANGE> Added global header inline in layout */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Navigation buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                  aria-label="Go back"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => window.history.forward()}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                  aria-label="Go forward"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Center: Site title */}
              <Link href="/" className="text-xl font-semibold hover:text-primary transition-colors">
                ENS-HubPal™ Marketplace
              </Link>

              {/* Right: Navigation links */}
              <nav className="flex items-center gap-6">
                <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
                  Marketplace
                </Link>
                <Link href="/create" className="text-sm font-medium hover:text-primary transition-colors">
                  Create Project
                </Link>
                <Link href="/sponsor" className="text-sm font-medium hover:text-primary transition-colors">
                  Sponsor Demos
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
