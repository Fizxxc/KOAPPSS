"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { updateOrderStatus } from "@/lib/firebase/utils"
import type { Order } from "@/lib/firebase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Swal from "sweetalert2"

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [accountEmail, setAccountEmail] = useState("")
  const [accountPassword, setAccountPassword] = useState("")

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
      setOrders(ordersData)
    })
    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      Swal.fire({
        title: "Status Updated!",
        text: `Order status changed to ${newStatus}`,
        icon: "success",
        background: "#1a1a2e",
        color: "#fff",
      })
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "Failed to update status",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      })
    }
  }

  const handleVerifyPayment = async (orderId: string, status: "verified" | "rejected") => {
    if (status === "verified" && (!accountEmail || !accountPassword)) {
      Swal.fire({
        title: "Email & Password Diperlukan!",
        text: "Masukkan email dan password akun untuk customer",
        icon: "warning",
        background: "#1a1a2e",
        color: "#fff",
      })
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: status,
          accountEmail: status === "verified" ? accountEmail : undefined,
          accountPassword: status === "verified" ? accountPassword : undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to verify payment")

      Swal.fire({
        title: status === "verified" ? "Pembayaran Diverifikasi!" : "Pembayaran Ditolak",
        text: status === "verified" ? "Akun telah dikirim ke customer" : "Order telah dibatalkan",
        icon: "success",
        background: "#1a1a2e",
        color: "#fff",
      })

      setSelectedOrder(null)
      setAccountEmail("")
      setAccountPassword("")
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "Failed to process payment verification",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      })
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], string> = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    }
    return <Badge className={`${variants[status]} pixel-border`}>{status.toUpperCase()}</Badge>
  }

  const getPaymentBadge = (paymentStatus: Order["paymentStatus"]) => {
    const variants: Record<Order["paymentStatus"], string> = {
      unpaid: "bg-gray-500",
      pending_verification: "bg-yellow-500",
      verified: "bg-green-500",
      rejected: "bg-red-500",
    }
    const labels: Record<Order["paymentStatus"], string> = {
      unpaid: "UNPAID",
      pending_verification: "PENDING",
      verified: "VERIFIED",
      rejected: "REJECTED",
    }
    return <Badge className={`${variants[paymentStatus]} pixel-border`}>{labels[paymentStatus]}</Badge>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl pixel-text">Manajemen Order</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="pixel-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="pixel-text text-lg mb-2">Order #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">{order.createdAt.toDate().toLocaleString("id-ID")}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">Customer Info:</h4>
                <p>Nama: {order.orderDetails.customerName}</p>
                <p>Email: {order.orderDetails.email}</p>
                <p>Phone: {order.orderDetails.phone}</p>
                {order.orderDetails.notes && <p>Catatan: {order.orderDetails.notes}</p>}
              </div>

              <div>
                <h4 className="font-bold mb-2">Items:</h4>
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    {item.productName} x {item.quantity} = Rp {(item.price * item.quantity).toLocaleString()}
                  </div>
                ))}
              </div>

              {order.paymentProof && (
                <div>
                  <h4 className="font-bold mb-2">Bukti Pembayaran:</h4>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="pixel-border bg-transparent">
                        Lihat Bukti Transfer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="pixel-card max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="pixel-text">Bukti Transfer QRIS</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img
                          src={order.paymentProof || "/placeholder.svg"}
                          alt="Payment Proof"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {order.accountEmail && order.accountPassword && (
                <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-green-600">Akun Terkirim:</h4>
                  <p className="text-sm">Email: {order.accountEmail}</p>
                  <p className="text-sm">Password: {order.accountPassword}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Dikirim: {order.accountSentAt?.toDate().toLocaleString("id-ID")}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t gap-4">
                <span className="font-bold text-lg">Total: Rp {order.totalAmount.toLocaleString()}</span>

                <div className="flex gap-2">
                  {order.paymentStatus === "pending_verification" && (
                    <Dialog
                      open={selectedOrder?.id === order.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setSelectedOrder(null)
                          setAccountEmail("")
                          setAccountPassword("")
                        } else {
                          setSelectedOrder(order)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="pixel-button bg-green-600 hover:bg-green-700">Verifikasi Pembayaran</Button>
                      </DialogTrigger>
                      <DialogContent className="pixel-card">
                        <DialogHeader>
                          <DialogTitle className="pixel-text">Verifikasi Pembayaran & Kirim Akun</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="accountEmail">Email Akun untuk Customer *</Label>
                            <Input
                              id="accountEmail"
                              type="email"
                              value={accountEmail}
                              onChange={(e) => setAccountEmail(e.target.value)}
                              placeholder="customer@example.com"
                              className="pixel-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountPassword">Password Akun *</Label>
                            <Input
                              id="accountPassword"
                              type="text"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              placeholder="password123"
                              className="pixel-border"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 pixel-button bg-green-600 hover:bg-green-700"
                              onClick={() => handleVerifyPayment(order.id, "verified")}
                            >
                              Verifikasi & Kirim Akun
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1 pixel-button"
                              onClick={() => handleVerifyPayment(order.id, "rejected")}
                            >
                              Tolak Pembayaran
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                  >
                    <SelectTrigger className="w-[180px] pixel-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="pixel-border bg-card">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
