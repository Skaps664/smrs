import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: startupId } = await params
    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    // Verify user has access to this startup
    let hasAccess = false

    if (userRole === "STARTUP") {
      // Check if user owns this startup
      const startup = await prisma.startup.findUnique({
        where: { id: startupId, userId },
      })
      hasAccess = !!startup
    } else if (userRole === "MENTOR") {
      // Check if user is mentor for this startup
      const access = await prisma.startupMentorAccess.findFirst({
        where: { startupId, mentorId: userId },
      })
      hasAccess = !!access
    } else if (userRole === "INVESTOR") {
      // Check if user is investor for this startup
      const access = await prisma.startupInvestorAccess.findFirst({
        where: { startupId, investorId: userId },
      })
      hasAccess = !!access
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You don't have access to this startup" },
        { status: 403 }
      )
    }

    // Fetch startup details
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      select: {
        id: true,
        name: true,
        industry: true,
        stage: true,
        niche: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: startup.id,
      name: startup.name,
      industry: startup.industry,
      stage: startup.stage,
      niche: startup.niche,
      founderName: startup.user.name,
      founderEmail: startup.user.email,
    })
  } catch (error) {
    console.error("Error fetching startup:", error)
    return NextResponse.json(
      { error: "Failed to fetch startup" },
      { status: 500 }
    )
  }
}
