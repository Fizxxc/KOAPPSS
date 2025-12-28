"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { SiteSettings } from "@/lib/firebase/types"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
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
        <h1 className="text-3xl md:text-4xl pixel-text mb-8 text-primary text-center">Hubungi Kami</h1>

        {loading ? (
          <div className="text-center animate-pulse py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="pixel-card text-center">
              <CardHeader>
                <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle className="pixel-text">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{settings?.contactEmail || "contact@kograph.com"}</p>
                <Button asChild className="pixel-button">
                  <a href={`mailto:${settings?.contactEmail}`}>Kirim Email</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="pixel-card text-center">
              <CardHeader>
                <Phone className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <CardTitle className="pixel-text">Telepon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{settings?.contactPhone || "+62 812-3456-7890"}</p>
                <Button asChild variant="outline" className="pixel-button bg-transparent">
                  <a href={`tel:${settings?.contactPhone}`}>Hubungi</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="pixel-card text-center">
              <CardHeader>
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-accent" />
                <CardTitle className="pixel-text">WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">+{settings?.contactWhatsapp || "6281234567890"}</p>
                <Button asChild variant="outline" className="pixel-button bg-transparent">
                  <a href={`https://wa.me/${settings?.contactWhatsapp}`} target="_blank" rel="noopener noreferrer">
                    Chat WA
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
