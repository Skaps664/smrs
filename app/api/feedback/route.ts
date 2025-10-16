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

    const feedback = await prisma.mentorFeedback.findMany({
      where: { startupId },
      orderBy: { meetingDate: "desc" },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
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

    const feedback = await prisma.mentorFeedback.create({
      data: {
        startupId,
        mentorName: data.mentorName,
        mentorEmail: data.mentorEmail || null,
        meetingDate: new Date(data.meetingDate),
        meetingNotes: data.meetingNotes || "",
        feedback: data.feedback || "",
        assignedTasks: data.assignedTasks || [],
        progressScore: data.progressScore ? Number(data.progressScore) : null,
      },
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error("Error creating feedback:", error)
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

    if (!id) {
      return NextResponse.json({ error: "Feedback ID required" }, { status: 400 })
    }

    // Verify ownership
    const feedback = await prisma.mentorFeedback.findUnique({
      where: { id },
      include: { startup: true },
    })

    if (!feedback || feedback.startup.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const updated = await prisma.mentorFeedback.update({
      where: { id },
      data: {
        mentorName: data.mentorName,
        mentorEmail: data.mentorEmail || null,
        meetingDate: data.meetingDate ? new Date(data.meetingDate) : undefined,
        meetingNotes: data.meetingNotes,
        feedback: data.feedback,
        assignedTasks: data.assignedTasks || [],
        progressScore: data.progressScore ? Number(data.progressScore) : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating feedback:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
