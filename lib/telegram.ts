export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("[v0] Telegram credentials not configured")
    return { success: false, error: "Telegram not configured" }
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to send Telegram notification:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendTelegramPhoto(photoBase64: string, caption: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("[v0] Telegram credentials not configured")
    return { success: false, error: "Telegram not configured" }
  }

  try {
    // Convert base64 to blob
    const base64Data = photoBase64.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")

    const formData = new FormData()
    formData.append("chat_id", chatId)
    formData.append("photo", new Blob([buffer], { type: "image/jpeg" }), "payment-proof.jpg")
    formData.append("caption", caption)
    formData.append("parse_mode", "HTML")

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to send Telegram photo:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
