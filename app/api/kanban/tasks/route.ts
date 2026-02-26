import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { columnId, content, order, isCompleted } = body

        if (!columnId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Verify ownership
        const column = await prisma.kanbanColumn.findUnique({
            where: { id: columnId },
            include: { startup: true }
        })

        if (!column || column.startup.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
        }

        const task = await prisma.kanbanTask.create({
            data: {
                columnId,
                content,
                order: order || 0,
                isCompleted: isCompleted || false
            },
        })

        return NextResponse.json(task, { status: 201 })
    } catch (error) {
        console.error("Error creating kanban task:", error)
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
        // Using an array of tasks for mass reordering, or a single task update
        if (Array.isArray(body.tasks)) {
            const { tasks } = body

            if (tasks.length > 0) {
                // Just verify the first task's column belongs to user
                const firstTask = await prisma.kanbanTask.findUnique({
                    where: { id: tasks[0].id },
                    include: { column: { include: { startup: true } } }
                })
                if (!firstTask || firstTask.column.startup.userId !== session.user.id) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 404 })
                }

                await prisma.$transaction(
                    tasks.map((t: any) =>
                        prisma.kanbanTask.update({
                            where: { id: t.id },
                            data: {
                                columnId: t.columnId,
                                order: t.order,
                            }
                        })
                    )
                )
            }
            return NextResponse.json({ success: true })
        } else {
            // Single task update
            const { id, content, isCompleted, columnId, order } = body

            const task = await prisma.kanbanTask.findUnique({
                where: { id },
                include: { column: { include: { startup: true } } }
            })

            if (!task || task.column.startup.userId !== session.user.id) {
                return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
            }

            const updateData: any = {}
            if (content !== undefined) updateData.content = content
            if (isCompleted !== undefined) updateData.isCompleted = isCompleted
            if (columnId !== undefined) updateData.columnId = columnId
            if (order !== undefined) updateData.order = order

            const updatedTask = await prisma.kanbanTask.update({
                where: { id },
                data: updateData
            })

            return NextResponse.json(updatedTask)
        }
    } catch (error) {
        console.error("Error updating kanban task:", error)
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
            return NextResponse.json({ error: "Task ID required" }, { status: 400 })
        }

        // Verify ownership
        const task = await prisma.kanbanTask.findUnique({
            where: { id },
            include: { column: { include: { startup: true } } },
        })

        if (!task || task.column.startup.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
        }

        await prisma.kanbanTask.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting kanban task:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
