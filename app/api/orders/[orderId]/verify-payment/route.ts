import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const body = await req.json()
    const { accountEmail, accountPassword, paymentStatus } = body
    const { orderId } = params

    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const orderData = orderSnap.data()
    const updateData: any = {
      paymentStatus,
      updatedAt: Timestamp.now(),
    }

    // If payment is verified and account credentials are provided
    if (paymentStatus === "verified" && accountEmail && accountPassword) {
      updateData.accountEmail = accountEmail
      updateData.accountPassword = accountPassword
      updateData.accountSentAt = Timestamp.now()
      updateData.status = "completed"

      // Send notification to user
      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Terverifikasi!",
          message: `Pembayaran Anda telah dikonfirmasi. Akun Anda sudah dikirim ke email!`,
          read: false,
          link: `/profile`,
          createdAt: Timestamp.now(),
        })
      }

      // Send Telegram notification to user with account details
      const userTelegramMessage = `
✅ <b>PEMBAYARAN TERVERIFIKASI - KOGRAPH APPS</b> ✅

Halo ${orderData.userName},

Pembayaran Anda untuk Order #${orderId.slice(0, 8)} telah dikonfirmasi!

🎁 <b>AKUN ANDA:</b>
📧 Email: <code>${accountEmail}</code>
🔑 Password: <code>${accountPassword}</code>

<b>Detail Pesanan:</b>
${orderData.items.map((item: any) => `• ${item.productName}`).join("\n")}

💰 Total: Rp ${orderData.totalAmount.toLocaleString()}

<i>Simpan informasi akun Anda dengan aman.</i>
<i>Jika ada pertanyaan, hubungi kami!</i>

Terima kasih telah berbelanja di KOGRAPH - APPS! 🎉
      `

      try {
        await fetch(`${req.nextUrl.origin}/api/telegram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userTelegramMessage }),
        })
      } catch (error) {
        console.error("[v0] Failed to send Telegram notification:", error)
      }
    } else if (paymentStatus === "rejected") {
      // If payment is rejected
      updateData.status = "cancelled"

      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Ditolak",
          message: `Pembayaran untuk order #${orderId.slice(0, 8)} ditolak. Silakan hubungi admin untuk info lebih lanjut.`,
          read: false,
          link: `/profile`,
          createdAt: Timestamp.now(),
        })
      }
    }

    await updateDoc(orderRef, updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
