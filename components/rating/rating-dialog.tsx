"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import Swal from "sweetalert2"

interface RatingDialogProps {
  orderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RatingDialog({ orderId, open, onOpenChange, onSuccess }: RatingDialogProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, rating, comment }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit rating")
      }

      await Swal.fire({
        title: "Terima Kasih!",
        text: "Rating Anda telah dikirim",
        icon: "success",
        background: "#1a1a2e",
        color: "#fff",
      })

      onSuccess()
      onOpenChange(false)
      setComment("")
      setRating(5)
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengirim rating",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pixel-border bg-card">
        <DialogHeader>
          <DialogTitle className="pixel-text">Beri Rating</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Berikan rating untuk pesanan ini:</p>
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-12 h-12 ${
                      i < (hoveredRating || rating) ? "fill-accent text-accent" : "text-muted stroke-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm pixel-text text-primary">{rating} / 5</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Komentar (opsional):</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="pixel-border"
              placeholder="Bagikan pengalaman Anda..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full pixel-button">
            {loading ? "Mengirim..." : "Kirim Rating"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
