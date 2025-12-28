"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Swal from "sweetalert2"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, totalAmount, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [uploadingProof, setUploadingProof] = useState(false)
  const [paymentProof, setPaymentProof] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    notes: "",
  })

  const handlePaymentProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "Invalid File!",
        text: "Please upload an image file",
        icon: "error",
        background: "#fff",
        color: "#333",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "File Too Large!",
        text: "Maximum file size is 5MB",
        icon: "error",
        background: "#fff",
        color: "#333",
      })
      return
    }

    setUploadingProof(true)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentProof(reader.result as string)
        setUploadingProof(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("[v0] Payment proof upload error:", error)
      Swal.fire({
        title: "Upload Gagal!",
        text: "Terjadi kesalahan saat upload bukti pembayaran",
        icon: "error",
        background: "#fff",
        color: "#333",
      })
      setUploadingProof(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentProof) {
      Swal.fire({
        title: "Bukti Pembayaran Diperlukan!",
        text: "Silakan upload bukti transfer QRIS Anda",
        icon: "warning",
        background: "#fff",
        color: "#333",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "guest",
          userName: user?.displayName || formData.customerName,
          userEmail: user?.email || formData.email,
          items: cart,
          totalAmount,
          orderDetails: formData,
          paymentProof,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      clearCart()

      await Swal.fire({
        title: "Order Berhasil!",
        html: `
          <p>Order ID: <strong>${data.orderId}</strong></p>
          <p>Total: <strong>Rp ${totalAmount.toLocaleString("id-ID")}</strong></p>
          <p class="text-sm mt-2">Pembayaran Anda sedang diverifikasi.</p>
          <p class="text-sm">Akun akan dikirim setelah pembayaran dikonfirmasi!</p>
        `,
        icon: "success",
        confirmButtonText: "OK",
        background: "#fff",
        color: "#333",
      })

      router.push(user ? "/profile" : "/")
    } catch (error: any) {
      Swal.fire({
        title: "Order Gagal!",
        text: error.message || "Terjadi kesalahan",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        background: "#fff",
        color: "#333",
      })
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="min-h-screen pixel-bg flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl pixel-text mb-8 text-primary">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="pixel-text text-secondary">Detail Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nama Lengkap *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                      className="pixel-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="pixel-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon / WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="pixel-border"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="pixel-border"
                      placeholder="Tambahkan catatan khusus untuk pesanan Anda..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-bold text-lg pixel-text text-accent">Pembayaran QRIS</h3>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg text-center">
                      <p className="text-white font-bold mb-4">Scan QR Code untuk Pembayaran</p>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <Image src="/qris.jpg" alt="QRIS Payment" width={200} height={200} className="mx-auto" />
                      </div>
                      <p className="text-white text-sm mt-4">
                        Total: <span className="text-2xl font-bold">Rp {totalAmount.toLocaleString("id-ID")}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentProof" className="text-base font-bold">
                        Upload Bukti Transfer QRIS *
                      </Label>
                      <Input
                        id="paymentProof"
                        type="file"
                        accept="image/*"
                        onChange={handlePaymentProofUpload}
                        disabled={uploadingProof}
                        className="pixel-border cursor-pointer"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload screenshot bukti transfer QRIS Anda (max 5MB)
                      </p>
                    </div>

                    {uploadingProof && <p className="text-sm text-center text-primary animate-pulse">Uploading...</p>}

                    {paymentProof && (
                      <div className="border-2 border-green-500 rounded-lg p-4">
                        <p className="text-green-600 font-bold mb-2 flex items-center gap-2">
                          <span>✓</span> Bukti Pembayaran Terupload
                        </p>
                        <img
                          src={paymentProof || "/placeholder.svg"}
                          alt="Payment Proof Preview"
                          className="max-w-xs mx-auto rounded"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || uploadingProof || !paymentProof}
                    className="w-full pixel-button bg-primary text-white text-lg hover:bg-primary/90"
                  >
                    {loading ? "Memproses..." : "Kirim Pesanan & Bukti Pembayaran"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="pixel-card sticky top-24">
              <CardHeader>
                <CardTitle className="pixel-text text-accent">Ringkasan Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm border-b pb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-muted-foreground text-xs">
                          Rp {item.price.toLocaleString("id-ID")} x {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-primary">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">Rp {totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Total {cart.length} item dalam pesanan Anda
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
