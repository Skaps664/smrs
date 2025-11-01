import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { token } = await params

    const invite = await prisma.inviteLink.findUnique({
      where: { token },
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            industry: true,
            stage: true,
          },
        },
      },
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

    // Check if user has the correct role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (invite.inviteType === "MENTOR" && user.role !== "MENTOR") {
      return NextResponse.json(
        { error: "This invite is for mentors only. Please sign up as a mentor." },
        { status: 400 }
      )
    }

    if (invite.inviteType === "INVESTOR" && user.role !== "INVESTOR") {
      return NextResponse.json(
        { error: "This invite is for investors only. Please sign up as an investor." },
        { status: 400 }
      )
    }

    return NextResponse.json({ invite })
  } catch (error) {
    console.error("Error validating invite:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
