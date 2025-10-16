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

    // Verify ownership
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    })

    if (!startup || startup.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const trackers = await prisma.monthlyTracker.findMany({
      where: { startupId },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    })

    return NextResponse.json(trackers)
  } catch (error) {
    console.error("Error fetching monthly trackers:", error)
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

    const tracker = await prisma.monthlyTracker.create({
      data: {
        startupId,
        month: data.month,
        year: Number(data.year),
        summary: data.summary,
        keyAchievements: data.keyAchievements || [],
        majorChallenges: data.majorChallenges || [],
        lessonsLearned: data.lessonsLearned || [],
        nextMonthPlans: data.nextMonthPlans || [],
      },
    })

    return NextResponse.json(tracker, { status: 201 })
  } catch (error) {
    console.error("Error creating monthly tracker:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
