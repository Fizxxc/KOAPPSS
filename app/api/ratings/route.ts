import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, Timestamp, getDocs, query, collection } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createRating, updateStats } from "@/lib/firebase/utils"
import type { Order, Rating } from "@/lib/firebase/types"

export async function POST(req: NextRequest) {
  try {
    const { orderId, rating, comment } = await req.json()

    if (!orderId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Get order
    const orderDoc = await getDoc(doc(db, "orders", orderId))
    if (!orderDoc.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = { id: orderDoc.id, ...orderDoc.data() } as Order

    if (order.rated) {
      return NextResponse.json({ error: "Order already rated" }, { status: 400 })
    }

    // Create rating
    await createRating({
      orderId,
      userId: order.userId,
      userName: order.userName,
      rating,
      comment: comment || "",
      createdAt: Timestamp.now(),
    })

    // Calculate new average rating
    const ratingsSnapshot = await getDocs(query(collection(db, "ratings")))
    const ratings = ratingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Rating)
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

    await updateStats({ averageRating })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Rating creation error:", error)
    return NextResponse.json({ error: "Failed to create rating" }, { status: 500 })
  }
}
