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

    const milestones = await prisma.milestone.findMany({
      where: { startupId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(milestones)
  } catch (error) {
    console.error("Error fetching milestones:", error)
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

    const milestone = await prisma.milestone.create({
      data: {
        startupId,
        stage: data.stage,
        title: data.title,
        description: data.description || null,
        completed: data.completed || false,
        completedDate: data.completed ? new Date() : null,
        criteria: data.criteria || [],
      },
    })

    return NextResponse.json(milestone, { status: 201 })
  } catch (error) {
    console.error("Error creating milestone:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...data } = body

    // Verify ownership
    const existing = await prisma.milestone.findUnique({
      where: { id },
      include: { startup: true },
    })

    if (!existing || existing.startup.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const milestone = await prisma.milestone.update({
      where: { id },
      data: {
        ...data,
        completedDate: data.completed ? new Date() : null,
      },
    })

    return NextResponse.json(milestone)
  } catch (error) {
    console.error("Error updating milestone:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
