import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all business model canvas versions
export async function GET(req: NextRequest) {
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
      return NextResponse.json({ error: "No startup found" }, { status: 404 })
    }

    const startupId = user.startups[0].id

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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { startups: true },
    })

    if (!user || user.startups.length === 0) {
      return NextResponse.json({ error: "No startup found" }, { status: 404 })
    }

    const startupId = user.startups[0].id
    const body = await req.json()

    // Get the latest version number
    const latestVersion = await prisma.businessModelCanvas.findFirst({
      where: { startupId },
      orderBy: { versionNumber: 'desc' },
    })

    const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1

    const businessModel = await prisma.businessModelCanvas.create({
      data: {
        startupId,
        versionName: body.versionName,
        versionNumber: nextVersionNumber,
        status: body.status || 'DRAFT',
        customerSegments: body.customerSegments || [],
        valuePropositions: body.valuePropositions || [],
        channels: body.channels || [],
        customerRelationships: body.customerRelationships || [],
        revenueStreams: body.revenueStreams || [],
        keyResources: body.keyResources || [],
        keyActivities: body.keyActivities || [],
        keyPartnerships: body.keyPartnerships || [],
        costStructure: body.costStructure || [],
        notes: body.notes,
        targetMarket: body.targetMarket,
        completionPercentage: body.completionPercentage || 0,
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
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
