"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { SiteSettings } from "@/lib/firebase/types"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "main"),
      (doc) => {
        if (doc.exists()) {
          setSettings({ id: doc.id, ...doc.data() } as SiteSettings)
        }
        setLoading(false)
      },
      (error) => {
        console.error("[v0] Settings fetch error:", error)
        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen pixel-bg flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl pixel-text mb-8 text-primary text-center">Tentang Kami</h1>
        <Card className="pixel-card max-w-4xl mx-auto">
          <CardContent className="p-8">
            {loading ? (
              <div className="text-center animate-pulse">Loading...</div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {settings?.aboutUs ||
                    "KOGRAPH - APPS adalah platform terpercaya untuk menyediakan aplikasi dan layanan digital berkualitas premium."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
