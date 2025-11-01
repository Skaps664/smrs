import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    // Only mentors can submit feedback
    if (userRole !== "MENTOR") {
      return NextResponse.json(
        { error: "Only mentors can submit feedback" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { startupId, sectionId, sectionName, rating, feedback, suggestions } = body

    if (!startupId || !feedback) {
      return NextResponse.json(
        { error: "Startup ID and feedback are required" },
        { status: 400 }
      )
    }

    // Verify mentor has access to this startup
    const mentorAccess = await prisma.startupMentorAccess.findFirst({
      where: {
        startupId,
        mentorId: userId,
      },
    })

    if (!mentorAccess) {
      return NextResponse.json(
        { error: "You don't have access to this startup" },
        { status: 403 }
      )
    }

    // Get mentor details
    const mentor = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    })

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
    }

    // Create feedback
    const newFeedback = await prisma.mentorFeedback.create({
      data: {
        startupId,
        mentorName: mentor.name || "Unknown Mentor",
        mentorEmail: mentor.email,
        meetingDate: new Date(),
        meetingNotes: `Section-specific feedback for ${sectionName}`,
        feedback,
        assignedTasks: suggestions ? [suggestions] : [],
        progressScore: rating,
        sectionId,
        sectionName,
        rating,
        suggestions,
      },
    })

    return NextResponse.json({
      success: true,
      feedback: newFeedback,
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}
