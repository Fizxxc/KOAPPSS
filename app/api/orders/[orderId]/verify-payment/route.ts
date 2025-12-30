import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp, FieldValue } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { paymentStatus, accountEmail, accountPassword } = body

    if (!paymentStatus) {
      return NextResponse.json(
        { error: "paymentStatus is required" },
        { status: 400 }
      )
    }

    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const orderData: any = orderSnap.data() || {}

    const updateData: any = {
      paymentStatus,
      updatedAt: serverTimestamp(),
    }

    if (paymentStatus === "verified") {
      if (!accountEmail || !accountPassword) {
        return NextResponse.json(
          { error: "Account email & password required" },
          { status: 400 }
        )
      }

      updateData.accountEmail = accountEmail
      updateData.accountPassword = accountPassword
      updateData.accountSentAt = serverTimestamp()
      updateData.status = "completed"

      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Terverifikasi!",
          message: "Pembayaran Anda telah dikonfirmasi. Akun sudah dikirim.",
          read: false,
          link: "/profile",
          createdAt: serverTimestamp() as FieldValue,
        })
      }

      const itemsText = Array.isArray(orderData.items)
        ? orderData.items.map((item: any) => `• ${item.productName}`).join("\n")
        : "-"

      const totalText =
        typeof orderData.totalAmount === "number"
          ? orderData.totalAmount.toLocaleString("id-ID")
          : "-"

      const userName = orderData.userName || "Customer"

      const userTelegramMessage = `✅ <b>PEMBAYARAN TERVERIFIKASI - KOGRAPH APPS</b> ✅\n\nHalo ${userName},\n\nPembayaran Anda untuk Order #${orderId.slice(0, 8)} telah dikonfirmasi!\n\n🎁 <b>AKUN ANDA:</b>\n📧 Email: <code>${accountEmail}</code>\n🔑 Password: <code>${accountPassword}</code>\n\n<b>Detail Pesanan:</b>\n${itemsText}\n\n💰 Total: Rp ${totalText}\n\nTerima kasih telah berbelanja di KOGRAPH - APPS! 🎉`

      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/telegram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userTelegramMessage }),
        })
      } catch (err) {
        console.error("Telegram send failed:", err)
      }
    }

    if (paymentStatus === "rejected") {
      updateData.status = "cancelled"

      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Ditolak",
          message: `Pembayaran untuk order #${orderId.slice(0, 8)} ditolak.`,
          read: false,
          link: "/profile",
          createdAt: serverTimestamp() as FieldValue,
        })
      }
    }

    await updateDoc(orderRef, updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
