import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret")

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  revalidatePath("/")
  revalidatePath("/knowledge")
  revalidatePath("/projects")
  revalidatePath("/write-ups")

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  })
}