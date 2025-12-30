import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminFieldValue } from "@/lib/firebase/admin";
import { createNotification } from "@/lib/firebase/utils";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ UPDATE PAYMENT STATUS
    await orderRef.update({
      paymentStatus: "verified",
      status: "processing",
      updatedAt: adminFieldValue.serverTimestamp(),
    });

    const order = orderSnap.data();

    // 🔔 NOTIFY USER
    if (order?.userId && order.userId !== "guest") {
      await createNotification({
        userId: order.userId,
        type: "payment",
        title: "Pembayaran Diverifikasi",
        message: `Pembayaran untuk pesanan ${orderId.slice(
          0,
          8
        )} telah diverifikasi.`,
        read: false,
        link: "/profile",
        createdAt: adminFieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", detail: error.message },
      { status: 500 }
    );
  }
}
