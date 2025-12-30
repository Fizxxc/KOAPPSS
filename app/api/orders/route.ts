import { type NextRequest, NextResponse } from "next/server"
import { Timestamp, addDoc, collection, doc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"
import type { Order } from "@/lib/firebase/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, userName, userEmail, items, totalAmount, orderDetails, paymentProof } = body

    console.log("Order request received:", { userId, userName, itemsCount: items?.length })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    if (!paymentProof) {
      return NextResponse.json({ error: "Payment proof is required" }, { status: 400 })
    }

    if (!orderDetails?.phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    const orderData: Omit<Order, "id"> = {
      userId: userId || "guest",
      userName: userName || "Guest",
      userEmail: userEmail || "",
      items,
      totalAmount,
      orderDetails,
      paymentProof,
      paymentStatus: "pending_verification",
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      rated: false,
    }

    console.log("[v0] Creating order...")
    const orderRef = await addDoc(collection(db, "orders"), orderData)
    const orderId = orderRef.id
    console.log("[v0] Order created:", orderId)

    try {
      await updateDoc(doc(db, "stats", "main"), {
        projectsCompleted: increment(1),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("[v0] Failed to update stats:", error)
    }

    try {
      if (userId && userId !== "guest") {
        await createNotification({
          userId,
          type: "order",
          title: "Pesanan Diterima",
          message: `Pesanan Anda dengan ID ${orderId.slice(0, 8)} sedang diproses. Pembayaran sedang diverifikasi.`,
          read: false,
          link: `/profile`,
          createdAt: Timestamp.now(),
        })
      }

      await createNotification({
        userId: "admin",
        type: "order",
        title: "Pesanan Baru dengan Pembayaran!",
        message: `Order baru dari ${userName} - Total: Rp ${totalAmount.toLocaleString()} - Verifikasi pembayaran diperlukan!`,
        read: false,
        link: `/admin`,
        createdAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("[v0] Failed to create notifications:", error)
    }

    const telegramCaption = `
🔔 PESANAN BARU - KOGRAPH APPS 🔔

📦 Order ID: ${orderId.slice(0, 8)}
👤 Customer: ${userName}
📧 Email: ${userEmail}
📱 Phone: ${orderDetails.phone}

Items:
${items.map((item: any) => `• ${item.productName} x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}`).join("\n")}

💰 Total: Rp ${totalAmount.toLocaleString()}
💳 Status: Menunggu Verifikasi

${orderDetails.notes ? `📝 Catatan: ${orderDetails.notes}` : ""}

⚡ Segera verifikasi dan kirim akun!
    `

    try {
      // Send payment proof as photo
      await fetch(`${req.nextUrl.origin}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo: paymentProof,
          caption: telegramCaption,
        }),
      })
      console.log("[v0] Telegram notification sent")
    } catch (error) {
      console.error("[v0] Failed to send Telegram notification:", error)
    }

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 },
    )
  }
}
