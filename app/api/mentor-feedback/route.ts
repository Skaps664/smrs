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

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, name: true },
    })

    if (user?.role !== "MENTOR") {
      return NextResponse.json({ error: "Only mentors can give feedback" }, { status: 403 })
    }

    const body = await request.json()
    const { startupId, section, heading, feedback, rating, sectionData } = body

    if (!startupId || !section || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify mentor has access to this startup
    const mentorAccess = await prisma.startupMentorAccess.findFirst({
      where: {
        startupId,
        mentorId: session.user.id,
      },
    })

    if (!mentorAccess) {
      return NextResponse.json({ error: "You don't have access to this startup" }, { status: 403 })
    }

    // Create feedback record with heading
    const sectionWithHeading = heading && heading !== "General" 
      ? `${section} - ${heading}` 
      : section

    const feedbackRecord = await prisma.mentorFeedback.create({
      data: {
        startupId,
        mentorName: user.name || session.user.name || "Mentor",
        mentorEmail: session.user.email || "",
        sectionId: section.toLowerCase().replace(/\s+/g, "-"),
        sectionName: sectionWithHeading,
        feedback,
        meetingNotes: `Feedback on ${sectionWithHeading}`,
        rating: rating || null,
        progressScore: rating || null,
        meetingDate: new Date(),
        assignedTasks: [],
        suggestions: sectionData ? JSON.stringify({ ...sectionData, heading }) : JSON.stringify({ heading }),
      },
    })

    return NextResponse.json({ success: true, feedback: feedbackRecord }, { status: 201 })
  } catch (error) {
    console.error("Error creating mentor feedback:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}
