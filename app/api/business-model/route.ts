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

// GET all business model canvas versions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    let startupId = searchParams.get("startupId")

    if (!startupId) {
      const startup = await prisma.startup.findFirst({ where: { userId: session.user.id } })
      if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 400 })
      startupId = startup.id
    } else {
      const hasAccess = await verifyStartupAccess(startupId, session.user.id)
      if (!hasAccess) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    const businessModels = await prisma.businessModelCanvas.findMany({
      where: { startupId },
      orderBy: [
        { versionNumber: 'desc' },
        { createdAt: 'desc' }
      ],
    })

    return NextResponse.json(businessModels)
  } catch (error) {
    console.error("Error fetching business models:", error)
    return NextResponse.json(
      { error: "Failed to fetch business models" },
      { status: 500 }
    )
  }
}

// POST create new business model canvas
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    let { startupId, ...businessData } = body

    if (!startupId) {
      const startup = await prisma.startup.findFirst({ where: { userId: session.user.id } })
      if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 400 })
      startupId = startup.id
    } else {
      const hasAccess = await verifyStartupAccess(startupId, session.user.id)
      if (!hasAccess) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    // Get the latest version number
    const latestVersion = await prisma.businessModelCanvas.findFirst({
      where: { startupId },
      orderBy: { versionNumber: 'desc' },
    })

    const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1

    const businessModel = await prisma.businessModelCanvas.create({
      data: {
        startupId,
        versionName: businessData.versionName,
        versionNumber: nextVersionNumber,
        status: businessData.status || 'DRAFT',
        customerSegments: businessData.customerSegments || [],
        valuePropositions: businessData.valuePropositions || [],
        channels: businessData.channels || [],
        customerRelationships: businessData.customerRelationships || [],
        revenueStreams: businessData.revenueStreams || [],
        keyResources: businessData.keyResources || [],
        keyActivities: businessData.keyActivities || [],
        keyPartnerships: businessData.keyPartnerships || [],
        costStructure: businessData.costStructure || [],
        notes: businessData.notes,
        targetMarket: businessData.targetMarket,
        completionPercentage: businessData.completionPercentage || 0,
      },
    })

    return NextResponse.json(businessModel, { status: 201 })
  } catch (error) {
    console.error("Error creating business model:", error)
    return NextResponse.json(
      { error: "Failed to create business model" },
      { status: 500 }
    )
  }
}

// PUT update existing business model canvas
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    let { id, startupId, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const item = await prisma.businessModelCanvas.findUnique({
      where: { id },
      select: { startupId: true }
    })

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Default to the item's startupId if not provided in the request
    startupId = startupId || item.startupId

    const hasAccess = await verifyStartupAccess(startupId, session.user.id)
    if (!hasAccess || item.startupId !== startupId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const businessModel = await prisma.businessModelCanvas.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(businessModel)
  } catch (error) {
    console.error("Error updating business model:", error)
    return NextResponse.json(
      { error: "Failed to update business model" },
      { status: 500 }
    )
  }
}

// DELETE business model canvas
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const item = await prisma.businessModelCanvas.findUnique({
      where: { id },
      select: { startupId: true }
    })

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const hasAccess = await verifyStartupAccess(item.startupId, session.user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    await prisma.businessModelCanvas.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Business model deleted successfully" })
  } catch (error) {
    console.error("Error deleting business model:", error)
    return NextResponse.json(
      { error: "Failed to delete business model" },
      { status: 500 }
    )
  }
}
