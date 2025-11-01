import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get("startupId")

    if (!startupId) {
      return NextResponse.json({ error: "Startup ID required" }, { status: 400 })
    }

    // Verify access: owner, mentor, or investor
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        mentorAccess: true,
        investorAccess: true,
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    // Check if user has access
    const isOwner = startup.userId === session.user.id
    const isMentor = startup.mentorAccess?.mentorId === session.user.id
    const isInvestor = startup.investorAccess?.some((inv: { investorId: string }) => inv.investorId === session.user.id)

    console.log('Weekly API Access Check:', {
      startupId,
      userId: session.user.id,
      isOwner,
      isMentor,
      isInvestor,
      hasMentorAccess: !!startup.mentorAccess,
      mentorId: startup.mentorAccess?.mentorId
    })

    if (!isOwner && !isMentor && !isInvestor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const trackers = await prisma.weeklyTracker.findMany({
      where: { startupId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(trackers)
  } catch (error) {
    console.error("Error fetching weekly trackers:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { startupId, ...data } = body

    // Verify ownership
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    })

    if (!startup || startup.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const tracker = await prisma.weeklyTracker.create({
      data: {
        startupId,
        ...data,
      },
    })

    return NextResponse.json(tracker, { status: 201 })
  } catch (error) {
    console.error("Error creating weekly tracker:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
