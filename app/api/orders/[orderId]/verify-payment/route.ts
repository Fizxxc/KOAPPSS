import { NextResponse } from "next/server"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function POST(
  req: Request,
  { params }: { params: { orderId?: string } }
) {
  try {
    // ===============================
    // 🔥 AMBIL ORDER ID DI SINI
    // ===============================
    const url = new URL(req.url)

    const orderId =
      params?.orderId ||                     // App Router normal
      url.searchParams.get("orderId") ||      // fallback
      url.searchParams.get("nxtPorderId")     // kasus error kamu

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID tidak ditemukan" },
        { status: 400 }
      )
    }

    // ===============================
    // 🔍 AMBIL DATA ORDER
    // ===============================
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      )
    }

    const orderData = orderSnap.data()

    // ===============================
    // ❌ CEGAH VERIFY ULANG
    // ===============================
    if (orderData.status === "completed") {
      return NextResponse.json(
        { message: "Order sudah diverifikasi" },
        { status: 200 }
      )
    }

    // ===============================
    // ✅ UPDATE STATUS
    // ===============================
    await updateDoc(orderRef, {
      status: "completed",
      verifiedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      orderId
    })

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
