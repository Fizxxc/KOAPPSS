import { NextRequest, NextResponse } from "next/server"
import { adminDb, adminTimestamp } from "@/lib/firebase/admin"
import { createNotification } from "@/lib/firebase/utils"

export const runtime = "nodejs" // ⬅️ WAJIB

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await req.json()
    const { paymentStatus, accountEmail, accountPassword } = body
    const { orderId } = params

    if (!paymentStatus) {
      return NextResponse.json(
        { error: "paymentStatus is required" },
        { status: 400 }
      )
    }

    const orderRef = adminDb.collection("orders").doc(orderId)
    const orderSnap = await orderRef.get()

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }


    const orderData = orderSnap.data()

    const updateData: any = {
      paymentStatus,
      updatedAt: adminTimestamp.now(),
    }

    // ✅ VERIFIEDD
    if (paymentStatus === "verified") {
      updateData.status = "completed"

      if (accountEmail) updateData.accountEmail = accountEmail
      if (accountPassword) updateData.accountPassword = accountPassword
      updateData.accountSentAt = adminTimestamp.now()

      if (orderData?.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Berhasil 🎉",
          message: "Pembayaran Anda telah diverifikasi. Akun sudah dikirim oleh admin.",
          read: false,
          link: "/profile",
          createdAt: adminTimestamp.now(),
        })
      }
    }

    // ❌ REJECTED
    if (paymentStatus === "rejected") {
      updateData.status = "cancelled"

      if (orderData?.userId && orderData.userId !== "guest") {
        await createNotification({
          userId: orderData.userId,
          type: "status_update",
          title: "Pembayaran Ditolak ❌",
          message: "Pembayaran Anda ditolak. Silakan hubungi admin.",
          read: false,
          link: "/profile",
          createdAt: adminTimestamp.now(),
        })
      }
    }

    await orderRef.update(updateData)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("VERIFY PAYMENT ERROR:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        detail: error.message,
      },
      { status: 500 }
    )
  }
}
