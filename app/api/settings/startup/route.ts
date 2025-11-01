import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user || user.role !== "STARTUP") {
      return NextResponse.json(
        { error: "Only startup users can update startup settings" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { startupId, stage } = body

    if (!startupId || !stage) {
      return NextResponse.json(
        { error: "Startup ID and stage are required" },
        { status: 400 }
      )
    }

    // Verify user owns this startup
    const startup = await prisma.startup.findUnique({
      where: { id: startupId, userId: user.id },
    })

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found or access denied" },
        { status: 404 }
      )
    }

    // Update startup stage - this is the ONLY place where stage is stored
    const updatedStartup = await prisma.startup.update({
      where: { id: startupId },
      data: { stage },
      select: {
        id: true,
        name: true,
        stage: true,
      },
    })

    return NextResponse.json({
      message: "Startup stage updated successfully",
      startup: updatedStartup,
    })
  } catch (error) {
    console.error("Error updating startup:", error)
    return NextResponse.json(
      { error: "Failed to update startup" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user || user.role !== "STARTUP") {
      return NextResponse.json(
        { error: "Only startup users can delete startups" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { startupId } = body

    if (!startupId) {
      return NextResponse.json(
        { error: "Startup ID is required" },
        { status: 400 }
      )
    }

    // Verify user owns this startup
    const startup = await prisma.startup.findUnique({
      where: { id: startupId, userId: user.id },
      include: {
        mentorAccess: true,
        investorAccess: true,
      },
    })

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found or access denied" },
        { status: 404 }
      )
    }

    // Check if startup has mentor or investors
    if (startup.mentorAccess.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete startup while a mentor is assigned. Please remove the mentor first." },
        { status: 400 }
      )
    }

    if (startup.investorAccess.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete startup while investors are assigned. Please remove all investors first." },
        { status: 400 }
      )
    }

    // Delete startup - Prisma cascade will handle related records
    await prisma.startup.delete({
      where: { id: startupId },
    })

    return NextResponse.json({
      message: "Startup deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting startup:", error)
    return NextResponse.json(
      { error: "Failed to delete startup" },
      { status: 500 }
    )
  }
}
