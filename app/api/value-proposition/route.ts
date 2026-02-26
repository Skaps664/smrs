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

// GET all value propositions for a startup
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
      if (!hasAccess) return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const valuePropositions = await prisma.valueProposition.findMany({
      where: { startupId },
      orderBy: [
        { versionNumber: 'desc' },
        { createdAt: 'desc' }
      ],
    })

    return NextResponse.json(valuePropositions)
  } catch (error) {
    console.error("Error fetching value propositions:", error)
    return NextResponse.json(
      { error: "Failed to fetch value propositions" },
      { status: 500 }
    )
  }
}

// POST create new value proposition version
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    let { startupId, ...valPropData } = body

    if (!startupId) {
      const startup = await prisma.startup.findFirst({ where: { userId: session.user.id } })
      if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 400 })
      startupId = startup.id
    } else {
      const hasAccess = await verifyStartupAccess(startupId, session.user.id)
      if (!hasAccess) return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get the latest version number
    const latestVersion = await prisma.valueProposition.findFirst({
      where: { startupId },
      orderBy: { versionNumber: 'desc' },
    })

    const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1

    const valueProposition = await prisma.valueProposition.create({
      data: {
        startupId,
        versionName: valPropData.versionName,
        versionNumber: nextVersionNumber,
        status: valPropData.status || 'DRAFT',
        gainCreators: valPropData.gainCreators || [],
        productsServices: valPropData.productsServices || [],
        painRelievers: valPropData.painRelievers || [],
        customerGains: valPropData.customerGains || [],
        customerPains: valPropData.customerPains || [],
        customerJobs: valPropData.customerJobs || [],
        notes: valPropData.notes,
        targetAudience: valPropData.targetAudience,
      },
    })

    return NextResponse.json(valueProposition, { status: 201 })
  } catch (error) {
    console.error("Error creating value proposition:", error)
    return NextResponse.json(
      { error: "Failed to create value proposition" },
      { status: 500 }
    )
  }
}

// PUT update existing value proposition
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

    const item = await prisma.valueProposition.findUnique({
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

    const valueProposition = await prisma.valueProposition.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(valueProposition)
  } catch (error) {
    console.error("Error updating value proposition:", error)
    return NextResponse.json(
      { error: "Failed to update value proposition" },
      { status: 500 }
    )
  }
}

// DELETE value proposition
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

    const item = await prisma.valueProposition.findUnique({
      where: { id },
      select: { startupId: true }
    })

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const hasAccess = await verifyStartupAccess(item.startupId, session.user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    await prisma.valueProposition.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Value proposition deleted successfully" })
  } catch (error) {
    console.error("Error deleting value proposition:", error)
    return NextResponse.json(
      { error: "Failed to delete value proposition" },
      { status: 500 }
    )
  }
}
