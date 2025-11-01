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

    const body = await request.json()
    const { role, ...roleData } = body

    // Get user role from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update based on role
    let updateData: any = {}

    if (user.role === "STARTUP") {
      if (roleData.currentStage) {
        updateData.currentStage = roleData.currentStage
      }
    } else if (user.role === "MENTOR") {
      if (roleData.mentorCompany !== undefined) {
        updateData.mentorCompany = roleData.mentorCompany || null
      }
      if (roleData.mentorLinkedin !== undefined) {
        updateData.mentorLinkedin = roleData.mentorLinkedin || null
      }
      if (roleData.mentorLocation !== undefined) {
        updateData.mentorLocation = roleData.mentorLocation || null
      }
    } else if (user.role === "INVESTOR") {
      if (roleData.investorPortfolio !== undefined) {
        updateData.investorPortfolio = roleData.investorPortfolio || null
      }
      if (roleData.investorLocation !== undefined) {
        updateData.investorLocation = roleData.investorLocation || null
      }
    }

    // Update user with role-specific data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        currentStage: true,
        mentorCompany: true,
        mentorLinkedin: true,
        mentorLocation: true,
        investorPortfolio: true,
        investorLocation: true,
      },
    })

    return NextResponse.json({
      message: "Settings updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating role-specific settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
