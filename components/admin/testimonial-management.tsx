"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { Testimonial } from "@/lib/firebase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Check, X, Trash2 } from "lucide-react"
import Swal from "sweetalert2"

export function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    const q = query(collection(db, "testimonials"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const testimonialsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Testimonial)
      setTestimonials(testimonialsData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds))
    })
    return () => unsubscribe()
  }, [])

  const handleApprove = async (testimonialId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "testimonials", testimonialId), {
        isApproved: !currentStatus,
      })
      Swal.fire({
        title: "Berhasil!",
        text: !currentStatus ? "Testimoni disetujui" : "Testimoni ditolak",
        icon: "success",
        background: "#1a1a2e",
        color: "#fff",
      })
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      })
    }
  }

  const handleDelete = async (testimonialId: string) => {
    const result = await Swal.fire({
      title: "Hapus Testimoni?",
      text: "Testimoni akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      background: "#1a1a2e",
      color: "#fff",
    })

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "testimonials", testimonialId))
        Swal.fire({
          title: "Dihapus!",
          text: "Testimoni berhasil dihapus",
          icon: "success",
          background: "#1a1a2e",
          color: "#fff",
        })
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan",
          icon: "error",
          background: "#1a1a2e",
          color: "#fff",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl pixel-text">Manajemen Testimoni</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="pixel-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm">{testimonial.userName}</CardTitle>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? "fill-accent text-accent" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <Badge className={`pixel-border ${testimonial.isApproved ? "bg-green-500" : "bg-yellow-500"}`}>
                  {testimonial.isApproved ? "Approved" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm italic">"{testimonial.message}"</p>
              <p className="text-xs text-muted-foreground">
                {testimonial.createdAt.toDate().toLocaleDateString("id-ID")}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(testimonial.id, testimonial.isApproved)}
                  variant={testimonial.isApproved ? "outline" : "default"}
                  size="sm"
                  className="flex-1 pixel-button"
                >
                  {testimonial.isApproved ? <X className="w-4 h-4 mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                  {testimonial.isApproved ? "Tolak" : "Setujui"}
                </Button>
                <Button
                  onClick={() => handleDelete(testimonial.id)}
                  variant="destructive"
                  size="sm"
                  className="pixel-button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card className="pixel-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <p>Belum ada testimoni</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
