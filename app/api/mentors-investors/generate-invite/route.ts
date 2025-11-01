import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { inviteType, email } = body

    if (!inviteType || !['MENTOR', 'INVESTOR'].includes(inviteType)) {
      return NextResponse.json({ error: "Invalid invite type" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { startups: true },
    })

    if (!user || user.startups.length === 0) {
      return NextResponse.json(
        { error: "Please create a startup profile first" },
        { status: 400 }
      )
    }

    const startup = user.startups[0]

    // Check if mentor already exists (only one allowed)
    if (inviteType === 'MENTOR') {
      const existingMentor = await prisma.startupMentorAccess.findUnique({
        where: { startupId: startup.id },
      })

      if (existingMentor) {
        return NextResponse.json(
          { error: "A mentor is already assigned to this startup" },
          { status: 400 }
        )
      }

      // Check for active mentor invites
      const activeMentorInvite = await prisma.inviteLink.findFirst({
        where: {
          startupId: startup.id,
          inviteType: 'MENTOR',
          isActive: true,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
      })

      if (activeMentorInvite) {
        return NextResponse.json(
          { error: "An active mentor invite already exists" },
          { status: 400 }
        )
      }
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex')

    // Create invite link (expires in 7 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invite = await prisma.inviteLink.create({
      data: {
        startupId: startup.id,
        createdById: user.id,
        inviteType,
        token,
        email: email || null,
        expiresAt,
        isActive: true,
      },
    })

    return NextResponse.json({
      message: "Invite link generated successfully",
      invite,
      inviteUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/invite/${token}`,
    })
  } catch (error) {
    console.error("Error generating invite:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
