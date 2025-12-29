import { NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    /* ================= PARAMS ================= */
    const orderId = params?.orderId
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    /* ================= BODY ================= */
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const { paymentStatus, accountEmail, accountPassword } = body

    if (!paymentStatus) {
      return NextResponse.json(
        { error: "paymentStatus is required" },
        { status: 400 }
      )
    }

    /* ================= ORDER ================= */
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const orderData: any = orderSnap.data() || {}

    /* ================= UPDATE DATA ================= */
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

      updateData.status = "completed"
      updateData.accountEmail = accountEmail
      updateData.accountPassword = accountPassword
      updateData.accountSentAt = serverTimestamp()

      /* 🔔 In-app notification */
      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Terverifikasi!",
          message: "Pembayaran Anda telah dikonfirmasi. Akun sudah dikirim.",
          read: false,
          link: "/profile",
          createdAt: serverTimestamp(),
        })
      }

      /* ================= TELEGRAM MESSAGE ================= */
      const itemsText = Array.isArray(orderData.items)
        ? orderData.items
            .map((item: any) => `• ${item?.productName || "Produk"}`)
            .join("\n")
        : "-"

      const totalText =
        typeof orderData.totalAmount === "number"
          ? orderData.totalAmount.toLocaleString("id-ID")
          : "-"

      const userName = orderData.userName || "Customer"

      const telegramMessage = `
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
      `.trim()

      /* ================= SAFE TELEGRAM CALL ================= */
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      console.log("SITE_URL:", siteUrl)

      if (siteUrl) {
        fetch(`${siteUrl}/api/telegram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: telegramMessage }),
        }).catch(err => {
          console.error("Telegram send failed:", err)
        })
      } else {
        console.warn("NEXT_PUBLIC_SITE_URL is not defined")
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
          createdAt: serverTimestamp(),
        })
      }
    }

    /* ================= SAVE ================= */
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
