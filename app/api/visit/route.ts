import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const webhookUrl = "https://n8n-three.nn-dev.me/webhook/36c85455-8d98-410a-a623-9b7f46c57836"

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error(`Webhook error: ${res.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending to n8n:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
