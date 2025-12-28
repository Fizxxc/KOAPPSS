import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"
import type { Order } from "@/lib/firebase/types"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params
    const { status } = await req.json()

    if (!["pending", "processing", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Get order
    const orderDoc = await getDoc(doc(db, "orders", orderId))
    if (!orderDoc.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = { id: orderDoc.id, ...orderDoc.data() } as Order

    // Update status
    await updateDoc(doc(db, "orders", orderId), {
      status,
      updatedAt: Timestamp.now(),
    })

    // Create notification for user
    const statusMessages: Record<Order["status"], string> = {
      pending: "Menunggu konfirmasi",
      processing: "Sedang diproses",
      completed: "Selesai! Terima kasih atas pesanan Anda",
      cancelled: "Dibatalkan",
    }

    if (order.userId && order.userId !== "guest") {
      await createNotification({
        userId: order.userId,
        type: "status_update",
        title: "Update Status Pesanan",
        message: `Pesanan ${orderId.slice(0, 8)}: ${statusMessages[status]}`,
        read: false,
        link: `/profile`,
        createdAt: Timestamp.now(),
      })
    }

    // If completed, increment satisfied clients
    if (status === "completed") {
      await updateDoc(doc(db, "stats", "main"), {
        clientsSatisfied: (await getDoc(doc(db, "stats", "main"))).data()?.clientsSatisfied + 1 || 1,
        updatedAt: Timestamp.now(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Status update error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
