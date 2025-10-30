import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const startupId = searchParams.get("startupId")

    if (!startupId) {
      return NextResponse.json({ error: "Startup ID required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify startup belongs to user
    const startup = await prisma.startup.findFirst({
      where: {
        id: startupId,
        userId: user.id
      }
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: { startupId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { startupId, name, role, email, phone } = body

    if (!startupId || !name || !role) {
      return NextResponse.json(
        { error: "Startup ID, name, and role are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify startup belongs to user
    const startup = await prisma.startup.findFirst({
      where: {
        id: startupId,
        userId: user.id
      }
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        startupId,
        name,
        role,
        email: email || null,
        phone: phone || null
      }
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, name, role, email, phone } = body

    if (!id) {
      return NextResponse.json({ error: "Team member ID required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify team member belongs to user's startup
    const teamMember = await prisma.teamMember.findFirst({
      where: { id },
      include: { startup: true }
    })

    if (!teamMember || teamMember.startup.userId !== user.id) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    const updatedTeamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name: name || teamMember.name,
        role: role || teamMember.role,
        email: email !== undefined ? email : teamMember.email,
        phone: phone !== undefined ? phone : teamMember.phone
      }
    })

    return NextResponse.json(updatedTeamMember)
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Team member ID required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify team member belongs to user's startup
    const teamMember = await prisma.teamMember.findFirst({
      where: { id },
      include: { startup: true }
    })

    if (!teamMember || teamMember.startup.userId !== user.id) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Team member deleted successfully" })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 })
  }
}
