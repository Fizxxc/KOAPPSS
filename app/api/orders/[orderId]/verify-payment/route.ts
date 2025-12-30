import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { accountEmail, accountPassword, paymentStatus } = await req.json()
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

    // ✅ PAYMENT VERIFIED
    if (paymentStatus === "verified") {
      updateData.status = "completed"

      if (accountEmail) updateData.accountEmail = accountEmail
      if (accountPassword) updateData.accountPassword = accountPassword
      updateData.accountSentAt = Timestamp.now()

      // 🔔 In-app notification ONLY
      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Berhasil 🎉",
          message: "Pembayaran Anda telah diverifikasi. Akun sudah dikirim oleh admin.",
          read: false,
          link: "/profile",
          createdAt: Timestamp.now(),
        })
      }
    }

    // ❌ PAYMENT REJECTED
    if (paymentStatus === "rejected") {
      updateData.status = "cancelled"

      if (orderData.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Ditolak ❌",
          message: `Pembayaran order #${orderId.slice(0, 8)} ditolak. Silakan hubungi admin.`,
          read: false,
          link: "/profile",
          createdAt: Timestamp.now(),
        })
      }
    }

    await updateDoc(orderRef, updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
