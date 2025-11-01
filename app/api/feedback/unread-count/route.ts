import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.log("[Unread Count] Unauthorized - no session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get("startupId")

    if (!startupId) {
      console.log("[Unread Count] No startupId provided")
      return NextResponse.json({ error: "Startup ID required" }, { status: 400 })
    }

    console.log(`[Unread Count] Fetching for startupId: ${startupId}, userId: ${session.user.id}`)

    // Verify access (owner, mentor, or investor)
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        mentorAccess: true,
        investorAccess: true,
      },
    })

    if (!startup) {
      console.log(`[Unread Count] Startup not found: ${startupId}`)
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    const isOwner = startup.userId === session.user.id
    const isMentor = startup.mentorAccess?.mentorId === session.user.id
    const isInvestor = startup.investorAccess?.some(
      (inv: any) => inv.investorId === session.user.id
    )

    console.log(`[Unread Count] Access check - isOwner: ${isOwner}, isMentor: ${isMentor}, isInvestor: ${isInvestor}`)

    if (!isOwner && !isMentor && !isInvestor) {
      console.log("[Unread Count] Access denied")
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Count unread feedback
    const unreadCount = await prisma.mentorFeedback.count({
      where: {
        startupId,
        isRead: false,
      },
    })

    console.log(`[Unread Count] Found ${unreadCount} unread feedback items`)
    return NextResponse.json({ unreadCount })
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
