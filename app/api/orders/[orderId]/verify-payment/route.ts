import { NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
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

    /* ================= VERIFIED ================= */
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

      /* 🔔 In-app notification */
      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Terverifikasi!",
          message: "Pembayaran Anda telah dikonfirmasi. Akun sudah dikirim.",
          read: false,
          link: "/profile",
          createdAt: serverTimestamp() as any,
        })
      }

      /* 📩 Telegram message (SAFE) */
      const itemsText = Array.isArray(orderData.items)
        ? orderData.items.map((item: any) => `• ${item.productName}`).join("\n")
        : "-"

      const totalText =
        typeof orderData.totalAmount === "number"
          ? orderData.totalAmount.toLocaleString("id-ID")
          : "-"

      const userName = orderData.userName || "Customer"

      const userTelegramMessage = `
✅ <b>PEMBAYARAN TERVERIFIKASI - KOGRAPH APPS</b> ✅

Halo ${userName},

Pembayaran Anda untuk Order #${orderId.slice(0, 8)} telah dikonfirmasi!

🎁 <b>AKUN ANDA:</b>
📧 Email: <code>${accountEmail}</code>
🔑 Password: <code>${accountPassword}</code>

<b>Detail Pesanan:</b>
${itemsText}

💰 Total: Rp ${totalText}

<i>Simpan informasi akun Anda dengan aman.</i>
<i>Jika ada pertanyaan, hubungi kami!</i>

Terima kasih telah berbelanja di KOGRAPH - APPS! 🎉
      `.trim()

      /* 🚀 Call Telegram API (AMAN) */
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

    /* ================= REJECTED ================= */
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
          createdAt: serverTimestamp() as any,
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

console.log("SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL)
