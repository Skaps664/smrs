import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get all invite links
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
      return NextResponse.json({ invites: [] })
    }

    const startup = user.startups[0]

    const invites = await prisma.inviteLink.findMany({
      where: { startupId: startup.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ invites })
  } catch (error) {
    console.error("Error fetching invites:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
