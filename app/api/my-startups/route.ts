import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    let startups: any[] = []

    if (user.role === "MENTOR") {
      const mentorAccess = await prisma.startupMentorAccess.findMany({
        where: { mentorId: user.id },
        include: {
          startup: {
            select: {
              id: true,
              name: true,
              industry: true,
              stage: true,
              niche: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      startups = mentorAccess.map((access) => ({
        ...access.startup,
        joinedAt: access.joinedAt,
        accessType: "MENTOR",
      }))
    } else if (user.role === "INVESTOR") {
      const investorAccess = await prisma.startupInvestorAccess.findMany({
        where: { investorId: user.id },
        include: {
          startup: {
            select: {
              id: true,
              name: true,
              industry: true,
              stage: true,
              niche: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      startups = investorAccess.map((access) => ({
        ...access.startup,
        joinedAt: access.joinedAt,
        accessType: "INVESTOR",
      }))
    }

    return NextResponse.json({ startups, userRole: user.role })
  } catch (error) {
    console.error("Error fetching startups:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
