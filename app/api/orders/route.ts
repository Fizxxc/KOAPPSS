import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminTimestamp } from "@/lib/firebase/admin";
import { createNotification } from "@/lib/firebase/utils";
import type { Order } from "@/lib/firebase/types";
import admin from "firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      userName,
      userEmail,
      items,
      totalAmount,
      orderDetails,
      paymentProof,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!paymentProof) {
      return NextResponse.json(
        { error: "Payment proof is required" },
        { status: 400 }
      );
    }

    if (!orderDetails?.phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const orderData: Omit<Order, "id"> = {
      userId: userId || "guest",
      userName: userName || "Guest",
      userEmail: userEmail || "",
      items,
      totalAmount,
      orderDetails,
      paymentProof,
      paymentStatus: "pending_verification",
      status: "pending",
      createdAt: adminTimestamp.now(),
      updatedAt: adminTimestamp.now(),
      rated: false,
    };

    // ✅ CREATE ORDER
    const orderRef = await adminDb.collection("orders").add(orderData);
    const orderId = orderRef.id;

    // ✅ UPDATE STATS (AMAN 100%)
    try {
      await adminDb.collection("stats").doc("main").update({
        projectsCompleted: admin.firestore.FieldValue.increment(1),
        updatedAt: adminTimestamp.now(),
      });
    } catch (err) {
      console.error("Stats update failed:", err);
    }

    // 🔔 USER NOTIFICATION
    if (userId && userId !== "guest") {
      await createNotification({
        userId,
        type: "order",
        title: "Pesanan Diterima",
        message: `Pesanan ${orderId.slice(0, 8)} sedang diverifikasi.`,
        read: false,
        link: "/profile",
        createdAt: adminTimestamp.now(),
      });
    }

    // 🔔 ADMIN NOTIFICATION
    await createNotification({
      userId: "admin",
      type: "order",
      title: "Pesanan Baru",
      message: `Order baru dari ${userName} - Rp ${totalAmount.toLocaleString()}`,
      read: false,
      link: "/admin",
      createdAt: adminTimestamp.now(),
    });

    // 📣 TELEGRAM (AMAN)
    try {
      await fetch(`${req.nextUrl.origin}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo: paymentProof,
          caption: `🔔 ORDER BARU\nID: ${orderId.slice(
            0,
            8
          )}\nUser: ${userName}\nTotal: Rp ${totalAmount.toLocaleString()}`,
        }),
      });
    } catch (err) {
      console.error("Telegram failed:", err);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create order", detail: error.message },
      { status: 500 }
    );
  }
}
