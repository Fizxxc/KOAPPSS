import { NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createNotification } from "@/lib/firebase/utils"

export async function POST(
  req: Request,
  { params }: { params: { id: string } } // ✅ FIX
) {
  try {
    /* ================= PARAMS ================= */
    const orderId = params?.id // ✅ FIX
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
