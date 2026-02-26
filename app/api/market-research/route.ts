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

// GET - Load all market researches for a startup
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

    const researches = await prisma.marketResearch.findMany({
      where: { startupId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(researches)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new market research
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    let { startupId, ...researchData } = data

    if (!startupId) {
      const startup = await prisma.startup.findFirst({ where: { userId: session.user.id } })
      if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 400 })
      startupId = startup.id
    } else {
      const hasAccess = await verifyStartupAccess(startupId, session.user.id)
      if (!hasAccess) return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const newResearch = await prisma.marketResearch.create({
      data: {
        startupId,
        title: researchData.title,
        tam: researchData.tam || {},
        sam: researchData.sam || {},
        som: researchData.som || {},
        swot: researchData.swot || {},
        fourPs: researchData.fourPs || {},
        portersForces: researchData.portersForces || {},
        customerJourney: researchData.customerJourney || {},
        competitors: researchData.competitors || [],
        trends: researchData.trends || [],
      }
    })

    return NextResponse.json(newResearch)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update existing market research
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const updatedData = await request.json()
    let { startupId } = updatedData

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const researchInfo = await prisma.marketResearch.findUnique({
      where: { id },
      select: { startupId: true }
    })

    if (!researchInfo) return NextResponse.json({ error: "Not found" }, { status: 404 })

    startupId = startupId || researchInfo.startupId

    const hasAccess = await verifyStartupAccess(startupId, session.user.id)
    if (!hasAccess || researchInfo.startupId !== startupId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const updatedResearch = await prisma.marketResearch.update({
      where: { id },
      data: {
        title: updatedData.title,
        tam: updatedData.tam,
        sam: updatedData.sam,
        som: updatedData.som,
        swot: updatedData.swot,
        fourPs: updatedData.fourPs,
        portersForces: updatedData.portersForces,
        customerJourney: updatedData.customerJourney,
        competitors: updatedData.competitors,
        trends: updatedData.trends,
      }
    })

    return NextResponse.json(updatedResearch)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete market research
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const researchInfo = await prisma.marketResearch.findUnique({
      where: { id },
      select: { startupId: true }
    })

    if (!researchInfo) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const hasAccess = await verifyStartupAccess(researchInfo.startupId, session.user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    await prisma.marketResearch.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
