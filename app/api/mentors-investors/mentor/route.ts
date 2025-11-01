import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get current mentor
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { startups: true },
    })

    if (!user || user.startups.length === 0) {
      return NextResponse.json({ mentor: null })
    }

    const startup = user.startups[0]

    const mentorAccess = await prisma.startupMentorAccess.findUnique({
      where: { startupId: startup.id },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            mentorCompany: true,
            mentorLocation: true,
            mentorLinkedin: true,
          },
        },
      },
    })

    return NextResponse.json({ mentor: mentorAccess })
  } catch (error) {
    console.error("Error fetching mentor:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// Remove mentor
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { startups: true },
    })

    if (!user || user.startups.length === 0) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    const startup = user.startups[0]

    await prisma.startupMentorAccess.delete({
      where: { startupId: startup.id },
    })

    return NextResponse.json({ message: "Mentor removed successfully" })
  } catch (error) {
    console.error("Error removing mentor:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
