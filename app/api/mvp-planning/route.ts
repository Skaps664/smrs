import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Helper function to verify user has access to the startup
async function verifyStartupAccess(startupId: string, userId: string): Promise<boolean> {
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: {
      mentorAccess: true,
      investorAccess: true,
    }
  });

  if (!startup) return false;

  const isOwner = startup.userId === userId;
  const isMentor = startup.mentorAccess?.mentorId === userId;
  const isInvestor = startup.investorAccess?.some(inv => inv.investorId === userId);

  return isOwner || isMentor || isInvestor;
}

// GET - Load all MVP plans for a startup
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    let startupId = searchParams.get("startupId")

    if (!startupId) {
      const startup = await prisma.startup.findFirst({ where: { userId: session.user.id } })
      if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 400 })
      startupId = startup.id
    } else {
      const hasAccess = await verifyStartupAccess(startupId, session.user.id);
      if (!hasAccess) return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const plans = await prisma.mVP.findMany({
      where: { startupId },
      orderBy: { lastUpdated: "desc" }
    })

    return NextResponse.json(plans)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new MVP plan
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    let { startupId, ...planData } = data

    if (!startupId) {
      const startup = await prisma.startup.findFirst({ where: { userId: session.user.id } })
      if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 400 })
      startupId = startup.id
    } else {
      const hasAccess = await verifyStartupAccess(startupId, session.user.id)
      if (!hasAccess) return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const newPlan = await prisma.mVP.create({
      data: {
        startupId,
        title: planData.title || "New MVP Plan",
        mvpType: planData.mvpType || "",
        coreValue: planData.coreValue || "",
        targetCustomer: planData.targetCustomer || "",
        problemStatement: planData.problemStatement || "",
        proposedSolution: planData.proposedSolution || "",
        features: planData.features || [],
        hypotheses: planData.hypotheses || [],
        successMetrics: planData.successMetrics || [],
        budget: planData.budget || { estimated: "", breakdown: [] },
        timeline: planData.timeline || [],
        risks: planData.risks || [],
        learningGoals: planData.learningGoals || [],
        nextSteps: planData.nextSteps || [],
      }
    })

    return NextResponse.json(newPlan)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update existing MVP plan
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const updatedData = await request.json()
    let { startupId } = updatedData

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const planInfo = await prisma.mVP.findUnique({
      where: { id },
      select: { startupId: true }
    })

    if (!planInfo) return NextResponse.json({ error: "Not found" }, { status: 404 })

    startupId = startupId || planInfo.startupId

    const hasAccess = await verifyStartupAccess(startupId, session.user.id)
    if (!hasAccess || planInfo.startupId !== startupId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const updatedPlan = await prisma.mVP.update({
      where: { id },
      data: {
        title: updatedData.title,
        mvpType: updatedData.mvpType,
        coreValue: updatedData.coreValue,
        targetCustomer: updatedData.targetCustomer,
        problemStatement: updatedData.problemStatement,
        proposedSolution: updatedData.proposedSolution,
        features: updatedData.features,
        hypotheses: updatedData.hypotheses,
        successMetrics: updatedData.successMetrics,
        budget: updatedData.budget,
        timeline: updatedData.timeline,
        risks: updatedData.risks,
        learningGoals: updatedData.learningGoals,
        nextSteps: updatedData.nextSteps,
      }
    })

    return NextResponse.json(updatedPlan)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete MVP plan
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const planInfo = await prisma.mVP.findUnique({
      where: { id },
      select: { startupId: true }
    })

    if (!planInfo) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const hasAccess = await verifyStartupAccess(planInfo.startupId, session.user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    await prisma.mVP.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
