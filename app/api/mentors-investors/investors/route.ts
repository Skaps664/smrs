import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get all investors
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
      return NextResponse.json({ investors: [] })
    }

    const startup = user.startups[0]

    const investorAccess = await prisma.startupInvestorAccess.findMany({
      where: { startupId: startup.id },
      include: {
        investor: {
          select: {
            id: true,
            name: true,
            email: true,
            investorPortfolio: true,
            investorLocation: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    })

    return NextResponse.json({ investors: investorAccess })
  } catch (error) {
    console.error("Error fetching investors:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
