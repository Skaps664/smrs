import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { token } = await params

    const invite = await prisma.inviteLink.findUnique({
      where: { token },
    })

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    }

    if (!invite.isActive) {
      return NextResponse.json({ error: "Invite has been revoked" }, { status: 400 })
    }

    if (invite.usedAt) {
      return NextResponse.json({ error: "Invite has already been used" }, { status: 400 })
    }

    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ error: "Invite has expired" }, { status: 400 })
    }

    // Verify user role matches invite type
    if (invite.inviteType === "MENTOR" && user.role !== "MENTOR") {
      return NextResponse.json(
        { error: "This invite is for mentors only" },
        { status: 400 }
      )
    }

    if (invite.inviteType === "INVESTOR" && user.role !== "INVESTOR") {
      return NextResponse.json(
        { error: "This invite is for investors only" },
        { status: 400 }
      )
    }

    // Create access record
    if (invite.inviteType === "MENTOR") {
      // Check if mentor already exists
      const existingMentor = await prisma.startupMentorAccess.findUnique({
        where: { startupId: invite.startupId },
      })

      if (existingMentor) {
        return NextResponse.json(
          { error: "This startup already has a mentor assigned" },
          { status: 400 }
        )
      }

      await prisma.startupMentorAccess.create({
        data: {
          startupId: invite.startupId,
          mentorId: user.id,
        },
      })
    } else {
      // Check if investor already has access
      const existingAccess = await prisma.startupInvestorAccess.findFirst({
        where: {
          startupId: invite.startupId,
          investorId: user.id,
        },
      })

      if (existingAccess) {
        return NextResponse.json(
          { error: "You already have access to this startup" },
          { status: 400 }
        )
      }

      await prisma.startupInvestorAccess.create({
        data: {
          startupId: invite.startupId,
          investorId: user.id,
        },
      })
    }

    // Mark invite as used
    await prisma.inviteLink.update({
      where: { id: invite.id },
      data: {
        usedAt: new Date(),
        usedBy: user.email,
        isActive: false,
      },
    })

    return NextResponse.json({
      message: "Invite accepted successfully",
      startupId: invite.startupId,
    })
  } catch (error) {
    console.error("Error accepting invite:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
