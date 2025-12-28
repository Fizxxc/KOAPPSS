import { type NextRequest, NextResponse } from "next/server"
import { sendTelegramNotification, sendTelegramPhoto } from "@/lib/telegram"

export async function POST(req: NextRequest) {
  try {
    const { message, photo, caption } = await req.json()

    if (photo && caption) {
      const result = await sendTelegramPhoto(photo, caption)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 })
    }

    const result = await sendTelegramNotification(message)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Telegram API route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
