import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { feedbackIds, startupId } = body

    if (!feedbackIds || !Array.isArray(feedbackIds)) {
      return NextResponse.json({ error: "Invalid feedback IDs" }, { status: 400 })
    }

    if (!startupId) {
      return NextResponse.json({ error: "Startup ID required" }, { status: 400 })
    }

    // Verify ownership
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    })

    if (!startup || startup.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Mark feedback as read
    await prisma.mentorFeedback.updateMany({
      where: {
        id: { in: feedbackIds },
        startupId, // Ensure feedback belongs to this startup
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking feedback as read:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
