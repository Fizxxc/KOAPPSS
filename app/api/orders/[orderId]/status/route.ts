import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminFieldValue } from "@/lib/firebase/admin";
import { createNotification } from "@/lib/firebase/utils";
import type { Order } from "@/lib/firebase/types";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const { status } = await req.json();

    const allowedStatus: Order["status"][] = [
      "pending",
      "processing",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = { id: orderSnap.id, ...orderSnap.data() } as Order;

    // ✅ UPDATE STATUS
    await orderRef.update({
      status,
      updatedAt: adminFieldValue.serverTimestamp(),
    });

    // 🔔 USER NOTIFICATION
    const statusMessages: Record<Order["status"], string> = {
      pending: "Menunggu konfirmasi",
      processing: "Sedang diproses",
      completed: "Selesai! Terima kasih atas pesanan Anda",
      cancelled: "Dibatalkan",
    };

    if (order.userId && order.userId !== "guest") {
      await createNotification({
        userId: order.userId,
        type: "status_update",
        title: "Update Status Pesanan",
        message: `Pesanan ${orderId.slice(0, 8)}: ${statusMessages[status]}`,
        read: false,
        link: "/profile",
        createdAt: adminFieldValue.serverTimestamp(),
      });
    }

    // ✅ INCREMENT STATS (AMAN)
    if (status === "completed") {
      await adminDb.collection("stats").doc("main").update({
        clientsSatisfied: adminFieldValue.increment(1),
        updatedAt: adminFieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ORDER STATUS UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update status", detail: error.message },
      { status: 500 }
    );
  }
}
