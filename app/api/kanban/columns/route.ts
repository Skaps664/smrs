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

        // Verify ownership or access
        const startup = await prisma.startup.findFirst({
            where: {
                id: startupId,
                OR: [
                    { userId: session.user.id },
                    { mentorAccess: { mentorId: session.user.id } },
                    { investorAccess: { some: { investorId: session.user.id } } },
                ],
            },
        })

        if (!startup) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
        }

        const columns = await prisma.kanbanColumn.findMany({
            where: { startupId },
            include: {
                tasks: {
                    orderBy: { order: "asc" }
                }
            },
            orderBy: { order: "asc" },
        })

        return NextResponse.json(columns)
    } catch (error) {
        console.error("Error fetching kanban columns:", error)
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
        const { startupId, title, order } = body

        if (!startupId || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Verify ownership
        const startup = await prisma.startup.findUnique({
            where: { id: startupId },
        })

        if (!startup || startup.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
        }

        const column = await prisma.kanbanColumn.create({
            data: {
                startupId,
                title,
                order: order || 0,
            },
            include: { tasks: true }
        })

        return NextResponse.json(column, { status: 201 })
    } catch (error) {
        console.error("Error creating kanban column:", error)
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
        const { columns } = body

        if (!Array.isArray(columns)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }

        // We expect an array of columns with their new orders
        // To ensure security, verify the first column's ownership
        if (columns.length > 0) {
            const firstCol = await prisma.kanbanColumn.findUnique({
                where: { id: columns[0].id },
                include: { startup: true }
            })
            if (!firstCol || firstCol.startup.userId !== session.user.id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 404 })
            }
        }

        // Update in transaction
        await prisma.$transaction(
            columns.map((col: any) =>
                prisma.kanbanColumn.update({
                    where: { id: col.id },
                    data: { order: col.order, title: col.title }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating kanban columns:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Column ID required" }, { status: 400 })
        }

        // Verify ownership
        const column = await prisma.kanbanColumn.findUnique({
            where: { id },
            include: { startup: true },
        })

        if (!column || column.startup.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
        }

        await prisma.kanbanColumn.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting kanban column:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
