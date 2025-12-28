import { type NextRequest, NextResponse } from "next/server"
import { Timestamp } from "firebase/firestore"
import { createTestimonial } from "@/lib/firebase/utils"

export async function POST(req: NextRequest) {
  try {
    const { userId, userName, userPhoto, message, rating } = await req.json()

    if (!userId || !userName || !message || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await createTestimonial({
      userId,
      userName,
      userPhoto,
      message,
      rating,
      isApproved: false,
      createdAt: Timestamp.now(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Testimonial creation error:", error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
