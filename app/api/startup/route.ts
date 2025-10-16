import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const startups = await prisma.startup.findMany({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(startups)
  } catch (error) {
    console.error("Error fetching startups:", error)
    return NextResponse.json(
      { error: "Failed to fetch startups" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const startup = await prisma.startup.create({
      data: {
        userId: session.user.id,
        name: body.name,
        founders: body.founders || [],
        industry: body.industry,
        niche: body.niche,
        stage: body.stage || "IDEATION",
        secpRegistered: body.secpRegistered || false,
        secpNumber: body.secpNumber,
        fbrRegistered: body.fbrRegistered || false,
        ntnNumber: body.ntnNumber,
        trademarkFiled: body.trademarkFiled || false,
        trademarkNumber: body.trademarkNumber,
        vision: body.vision,
        mission: body.mission,
        tagline: body.tagline,
        email: body.email,
        phone: body.phone,
        address: body.address,
        website: body.website,
      },
    })

    return NextResponse.json(startup, { status: 201 })
  } catch (error) {
    console.error("Error creating startup:", error)
    return NextResponse.json(
      { error: "Failed to create startup" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...data } = body

    // Verify ownership
    const existing = await prisma.startup.findUnique({
      where: { id },
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const startup = await prisma.startup.update({
      where: { id },
      data,
    })

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error updating startup:", error)
    return NextResponse.json(
      { error: "Failed to update startup" },
      { status: 500 }
    )
  }
}
