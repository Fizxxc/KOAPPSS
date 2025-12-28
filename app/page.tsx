"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { Product, Stats, Testimonial } from "@/lib/firebase/types"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { ProductCard } from "@/components/store/product-card"
import { StatsDisplay } from "@/components/store/stats-display"
import { TestimonialCard } from "@/components/store/testimonial-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    const productsQuery = query(collection(db, "products"))
    const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
      setProducts(productsData)
    })

    const unsubStats = onSnapshot(doc(db, "stats", "main"), (doc) => {
      if (doc.exists()) {
        setStats({ id: doc.id, ...doc.data() } as Stats)
      }
    })

    const testimonialsQuery = query(collection(db, "testimonials"))
    const unsubTestimonials = onSnapshot(testimonialsQuery, (snapshot) => {
      const testimonialsData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as Testimonial)
        .filter((t) => t.isApproved)
      setTestimonials(testimonialsData)
    })

    return () => {
      unsubProducts()
      unsubStats()
      unsubTestimonials()
    }
  }, [])

  return (
    <div className="min-h-screen pixel-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <lord-icon
              src="https://cdn.lordicon.com/wzwygmng.json"
              trigger="loop"
              colors="primary:#a855f7,secondary:#06b6d4"
              style={{ width: "120px", height: "120px" }}
            ></lord-icon>
          </div>
          <h1 className="text-4xl md:text-6xl pixel-text text-primary animate-float">KOGRAPH - APPS</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Platform Premium untuk Aplikasi & Layanan Digital Berkualitas Tinggi
          </p>
          <p className="text-lg">Wujudkan Ide Digital Anda Bersama Kami</p>
          <Link href="#products">
            <Button size="lg" className="pixel-button text-lg animate-glow">
              <Sparkles className="w-5 h-5 mr-2" />
              Lihat Produk
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      {stats && <StatsDisplay stats={stats} />}

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl pixel-text text-center mb-12 text-primary">Produk Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl pixel-text text-center mb-12 text-secondary">Testimoni Klien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 6).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
