import { NextRequest, NextResponse } from "next/server"
import { adminDb, adminTimestamp } from "@/lib/firebase/admin"
import { createNotification } from "@/lib/firebase/utils"

export const runtime = "nodejs"

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    console.log("VERIFY PAYMENT PARAMS:", params)

    const orderId = params?.orderId
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID missing in params" },
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

    await orderRef.update({
      paymentStatus: "verified",
      status: "processing",
      updatedAt: adminTimestamp.now(),
    })

    const order = orderSnap.data()

    if (order?.userId && order.userId !== "guest") {
      await createNotification({
        userId: order.userId,
        type: "payment",
        title: "Pembayaran Diverifikasi",
        message: `Pesanan ${orderId.slice(0, 8)} telah diverifikasi.`,
        read: false,
        link: "/profile",
        createdAt: adminTimestamp.now(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("VERIFY PAYMENT ERROR:", error)
    return NextResponse.json(
      { error: "Failed to verify payment", detail: error.message },
      { status: 500 }
    )
  }
}
