import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get("startupId")

    if (!startupId) {
      return NextResponse.json({ error: "Startup ID required" }, { status: 400 })
    }

    // Verify access: owner, mentor, or investor
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        mentorAccess: true,
        investorAccess: true,
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    // Check if user has access
    const isOwner = startup.userId === session.user.id
    const isMentor = startup.mentorAccess?.mentorId === session.user.id
    const isInvestor = startup.investorAccess?.some((inv: { investorId: string }) => inv.investorId === session.user.id)

    if (!isOwner && !isMentor && !isInvestor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const kpis = await prisma.kPI.findMany({
      where: { startupId },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(kpis)
  } catch (error) {
    console.error("Error fetching KPIs:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { startupId, ...data } = body

    // Verify ownership
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    })

    if (!startup || startup.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const kpi = await prisma.kPI.create({
      data: {
        startupId,
        date: new Date(data.date),
        category: data.category,
        socialFollowers: data.socialFollowers ? Number(data.socialFollowers) : null,
        reach: data.reach ? Number(data.reach) : null,
        engagementRate: data.engagementRate ? parseFloat(data.engagementRate) : null,
        adSpend: data.adSpend ? parseFloat(data.adSpend) : null,
        leadsGenerated: data.leadsGenerated ? Number(data.leadsGenerated) : null,
        ordersPlaced: data.ordersPlaced ? Number(data.ordersPlaced) : null,
        unitsSold: data.unitsSold ? Number(data.unitsSold) : null,
        revenue: data.revenue ? parseFloat(data.revenue) : null,
        profitMargin: data.profitMargin ? parseFloat(data.profitMargin) : null,
        customerReturnRate: data.customerReturnRate ? parseFloat(data.customerReturnRate) : null,
        featuresCompleted: data.featuresCompleted ? Number(data.featuresCompleted) : null,
        prototypesTested: data.prototypesTested ? Number(data.prototypesTested) : null,
        qaResults: data.qaResults || null,
        suppliersOnboarded: data.suppliersOnboarded ? Number(data.suppliersOnboarded) : null,
        employeesAdded: data.employeesAdded ? Number(data.employeesAdded) : null,
        collaborators: data.collaborators ? Number(data.collaborators) : null,
        notes: data.notes || null,
      },
    })

    return NextResponse.json(kpi, { status: 201 })
  } catch (error) {
    console.error("Error creating KPI:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, startupId, ...data } = body

    if (!id) {
      return NextResponse.json({ error: "KPI ID required" }, { status: 400 })
    }

    // Verify ownership
    const kpi = await prisma.kPI.findUnique({
      where: { id },
      include: { startup: true },
    })

    if (!kpi || kpi.startup.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const updated = await prisma.kPI.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        category: data.category,
        socialFollowers: data.socialFollowers ? Number(data.socialFollowers) : null,
        reach: data.reach ? Number(data.reach) : null,
        engagementRate: data.engagementRate ? parseFloat(data.engagementRate) : null,
        adSpend: data.adSpend ? parseFloat(data.adSpend) : null,
        leadsGenerated: data.leadsGenerated ? Number(data.leadsGenerated) : null,
        ordersPlaced: data.ordersPlaced ? Number(data.ordersPlaced) : null,
        unitsSold: data.unitsSold ? Number(data.unitsSold) : null,
        revenue: data.revenue ? parseFloat(data.revenue) : null,
        profitMargin: data.profitMargin ? parseFloat(data.profitMargin) : null,
        customerReturnRate: data.customerReturnRate ? parseFloat(data.customerReturnRate) : null,
        featuresCompleted: data.featuresCompleted ? Number(data.featuresCompleted) : null,
        prototypesTested: data.prototypesTested ? Number(data.prototypesTested) : null,
        qaResults: data.qaResults || null,
        suppliersOnboarded: data.suppliersOnboarded ? Number(data.suppliersOnboarded) : null,
        employeesAdded: data.employeesAdded ? Number(data.employeesAdded) : null,
        collaborators: data.collaborators ? Number(data.collaborators) : null,
        notes: data.notes || null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating KPI:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
