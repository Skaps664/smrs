import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all value propositions for a startup
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
    const latestVersion = await prisma.valueProposition.findFirst({
      where: { startupId },
      orderBy: { versionNumber: 'desc' },
    })

    const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1

    const valueProposition = await prisma.valueProposition.create({
      data: {
        startupId,
        versionName: body.versionName,
        versionNumber: nextVersionNumber,
        status: body.status || 'DRAFT',
        gainCreators: body.gainCreators || [],
        productsServices: body.productsServices || [],
        painRelievers: body.painRelievers || [],
        customerGains: body.customerGains || [],
        customerPains: body.customerPains || [],
        customerJobs: body.customerJobs || [],
        notes: body.notes,
        targetAudience: body.targetAudience,
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
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
