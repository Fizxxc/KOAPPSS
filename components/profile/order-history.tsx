"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { Order } from "@/lib/firebase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star } from "lucide-react"
import { RatingDialog } from "@/components/rating/rating-dialog"

interface OrderHistoryProps {
  userId: string
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)

  useEffect(() => {
    const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
      setOrders(ordersData)
    })

    return () => unsubscribe()
  }, [userId])

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], string> = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    }
    return <Badge className={`${variants[status]} pixel-border`}>{status.toUpperCase()}</Badge>
  }

  const handleRateOrder = (orderId: string) => {
    setSelectedOrder(orderId)
    setRatingDialogOpen(true)
  }

  if (orders.length === 0) {
    return (
      <Card className="pixel-card">
        <CardContent className="p-12 text-center space-y-4">
          <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground opacity-50" />
          <h3 className="text-xl pixel-text">Belum Ada Pesanan</h3>
          <p className="text-muted-foreground">Riwayat pesanan Anda akan muncul di sini</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl pixel-text">Riwayat Pesanan</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="pixel-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="pixel-text text-lg mb-2">Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.createdAt.toDate().toLocaleString("id-ID")}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.productImage || "/placeholder.svg"}
                          alt={item.productName}
                          className="w-16 h-16 object-cover pixel-border"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x Rp {item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-bold">Rp {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold text-lg">Total: Rp {order.totalAmount.toLocaleString()}</span>
                  {order.status === "completed" && !order.rated && (
                    <Button onClick={() => handleRateOrder(order.id)} className="pixel-button">
                      <Star className="w-4 h-4 mr-2" /> Beri Rating
                    </Button>
                  )}
                  {order.rated && (
                    <Badge className="pixel-border bg-accent">
                      <Star className="w-4 h-4 mr-1 fill-white" /> Sudah Dirating
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <RatingDialog
          orderId={selectedOrder}
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          onSuccess={() => {
            setSelectedOrder(null)
          }}
        />
      )}
    </>
  )
}
