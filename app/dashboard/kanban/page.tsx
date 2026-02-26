"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Plus, X, MoreVertical, Loader2, GripVertical, CheckCircle, Circle, Edit2, Trash2 } from "lucide-react"

type KanbanTask = {
    id: string
    columnId: string
    content: string
    order: number
    isCompleted: boolean
}

type KanbanColumn = {
    id: string
    startupId: string
    title: string
    order: number
    tasks: KanbanTask[]
}

// --------------------------------------------------------------------------------
// Sortable Column Component
// --------------------------------------------------------------------------------
function SortableColumn({
    column,
    onAddCard,
    onDeleteColumn,
    onUpdateColumn,
    onUpdateTask,
    onDeleteTask
}: {
    column: KanbanColumn;
    onAddCard: (colId: string, content: string) => void;
    onDeleteColumn: (id: string) => void;
    onUpdateColumn: (id: string, title: string) => void;
    onUpdateTask: (task: KanbanTask, updates: any) => void;
    onDeleteTask: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const [isAdding, setIsAdding] = useState(false)
    const [newTaskContent, setNewTaskContent] = useState("")
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editTitle, setEditTitle] = useState(column.title)

    const handleAddCard = () => {
        if (newTaskContent.trim()) {
            onAddCard(column.id, newTaskContent.trim())
            setNewTaskContent("")
            setIsAdding(false)
        }
    }

    const handleTitleSubmit = () => {
        if (editTitle.trim() && editTitle !== column.title) {
            onUpdateColumn(column.id, editTitle.trim())
        }
        setIsEditingTitle(false)
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-[#1a1a1a] rounded-xl flex-shrink-0 w-80 h-[500px] border-2 border-orange-500/50 opacity-40"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-[#1a1a1a] rounded-xl flex-shrink-0 w-80 max-h-[calc(100vh-200px)] flex flex-col border border-gray-800 shadow-sm transition-colors hover:border-gray-700"
        >
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                className="p-4 border-b border-gray-800 flex items-center justify-between cursor-grab active:cursor-grabbing group"
            >
                <div className="flex items-center gap-2 flex-1">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            className="bg-[#242424] text-gray-100 text-sm px-2 py-1 rounded w-full focus:outline-none focus:ring-1 focus:ring-orange-500"
                            value={editTitle}
                            autoFocus
                            onBlur={handleTitleSubmit}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleTitleSubmit()
                                if (e.key === "Escape") {
                                    setEditTitle(column.title)
                                    setIsEditingTitle(false)
                                }
                            }}
                            onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when typing
                        />
                    ) : (
                        <h3
                            className="font-semibold text-gray-100 uppercase tracking-wider text-sm flex-1 truncate"
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                                setIsEditingTitle(true)
                            }}
                        >
                            {column.title}
                        </h3>
                    )}
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        {column.tasks.length}
                    </span>
                </div>

                <button
                    onClick={() => onDeleteColumn(column.id)}
                    onPointerDown={(e) => e.stopPropagation()} // prevent drag
                    className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete Column"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Task List */}
            <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto min-h-[150px] custom-scrollbar">
                <SortableContext
                    items={column.tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {column.tasks.map((task) => (
                        <SortableTask
                            key={task.id}
                            task={task}
                            onUpdate={onUpdateTask}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </SortableContext>
            </div>

            {/* Add Task Button/Form */}
            <div className="p-3 border-t border-gray-800">
                {isAdding ? (
                    <div className="bg-[#242424] p-3 rounded-lg border border-gray-700">
                        <textarea
                            autoFocus
                            placeholder="What needs to be done?"
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            className="w-full bg-transparent text-gray-200 text-sm outline-none resize-none h-16"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleAddCard()
                                }
                            }}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <button
                                onClick={handleAddCard}
                                className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded hover:bg-orange-600 transition-colors"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false)
                                    setNewTaskContent("")
                                }}
                                className="text-gray-400 hover:text-gray-200 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-200 hover:bg-[#242424] px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>
                )}
            </div>
        </div>
    )
}

// --------------------------------------------------------------------------------
// Sortable Task Component
// --------------------------------------------------------------------------------
function SortableTask({
    task,
    onUpdate,
    onDelete
}: {
    task: KanbanTask;
    onUpdate: (task: KanbanTask, updates: any) => void;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    })

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
    }

    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(task.content)

    const handleSave = () => {
        if (editContent.trim() && editContent !== task.content) {
            onUpdate(task, { content: editContent.trim() })
        }
        setIsEditing(false)
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-gray-800/50 border-2 border-orange-500/50 rounded-lg h-24 opacity-50"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group bg-[#242424] p-3 rounded-lg border ${task.isCompleted ? "border-green-500/30" : "border-gray-700 hover:border-gray-600"
                } shadow-sm cursor-grab active:cursor-grabbing text-sm flex gap-3 items-start transition-colors`}
        >
            <button
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag while clicking
                onClick={() => onUpdate(task, { isCompleted: !task.isCompleted })}
                className={`flex-shrink-0 mt-0.5 ${task.isCompleted ? "text-green-500" : "text-gray-500 hover:text-orange-500"} transition-colors`}
            >
                {task.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </button>

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <textarea
                        autoFocus
                        className="w-full bg-[#1a1a1a] text-gray-200 text-sm outline-none resize-none rounded p-2 focus:ring-1 focus:ring-orange-500"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onBlur={handleSave}
                        onPointerDown={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSave()
                            }
                            if (e.key === "Escape") {
                                setEditContent(task.content)
                                setIsEditing(false)
                            }
                        }}
                    />
                ) : (
                    <p
                        className={`text-gray-200 whitespace-pre-wrap ${task.isCompleted ? "line-through text-gray-500" : ""}`}
                        onDoubleClick={(e) => {
                            e.stopPropagation()
                            setIsEditing(true)
                        }}
                    >
                        {task.content}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-orange-500"
                    title="Edit"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onDelete(task.id)}
                    className="text-gray-500 hover:text-red-500"
                    title="Delete"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}

// --------------------------------------------------------------------------------
// Main Kanban Board Component
// --------------------------------------------------------------------------------
export default function KanbanBoardPage() {
    const { data: session } = useSession()
    const [startupId, setStartupId] = useState<string | null>(null)
    const [columns, setColumns] = useState<KanbanColumn[]>([])
    const [loading, setLoading] = useState(true)

    // Drag overlay state
    const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null)
    const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)

    // Fetch initial startup ID
    useEffect(() => {
        fetch("/api/startup")
            .then(r => r.json())
            .then(d => {
                const startupList = d.startups || []
                const startup = Array.isArray(startupList) ? startupList[0] : null

                if (startup?.id) {
                    setStartupId(startup.id)
                } else {
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    // Fetch board data
    const fetchData = async () => {
        if (!startupId) return
        try {
            const res = await fetch(`/api/kanban/columns?startupId=${startupId}`)
            if (res.ok) {
                const data = await res.json()
                setColumns(data)
            } else if (res.status === 404) {
                // If empty, auto-initialize basic columns? (Handled via Add Column button for simplicity)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (startupId) fetchData()
    }, [startupId])

    // Handlers
    const handleCreateColumn = async () => {
        if (!startupId) return
        const title = prompt("Enter column name (e.g., Backlog, In Progress):")
        if (!title?.trim()) return

        const order = columns.length > 0 ? columns[columns.length - 1].order + 1024 : 1024

        const res = await fetch("/api/kanban/columns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ startupId, title, order })
        })
        if (res.ok) fetchData()
    }

    const handleDeleteColumn = async (id: string) => {
        if (!confirm("Are you sure you want to delete this column and all its tasks?")) return
        const res = await fetch(`/api/kanban/columns?id=${id}`, { method: "DELETE" })
        if (res.ok) fetchData()
    }

    const handleUpdateColumn = async (id: string, title: string) => {
        const colToUpdate = columns.find(c => c.id === id)
        if (!colToUpdate) return

        setColumns(cols => cols.map(c => c.id === id ? { ...c, title } : c))

        await fetch("/api/kanban/columns", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ columns: [{ id, title, order: colToUpdate.order }] })
        })
    }

    const handleCreateTask = async (columnId: string, content: string) => {
        const col = columns.find(c => c.id === columnId)
        if (!col) return

        const order = col.tasks.length > 0 ? col.tasks[col.tasks.length - 1].order + 1024 : 1024

        // Optimistic UI update could go here
        const res = await fetch("/api/kanban/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ columnId, content, order })
        })
        if (res.ok) fetchData()
    }

    const handleUpdateTask = async (task: KanbanTask, updates: any) => {
        // Optimistic UI update
        setColumns(cols => cols.map(col => {
            if (col.id === task.columnId) {
                return {
                    ...col,
                    tasks: col.tasks.map(t => t.id === task.id ? { ...t, ...updates } : t)
                }
            }
            return col
        }))

        await fetch("/api/kanban/tasks", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: task.id, ...updates })
        })
    }

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Delete this task?")) return

        // Optimistic UI update
        setColumns(cols => cols.map(col => ({
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId)
        })))

        await fetch(`/api/kanban/tasks?id=${taskId}`, { method: "DELETE" })
    }

    // Sensors for DND
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px movement before dragging starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Drag handlers
    const onDragStart = (event: any) => {
        const { active } = event
        const type = active.data.current?.type
        if (type === "Column") setActiveColumn(active.data.current.column)
        if (type === "Task") setActiveTask(active.data.current.task)
    }

    const onDragOver = (event: any) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return

        const activeType = active.data.current?.type
        const overType = over.data.current?.type

        if (activeType !== "Task") return

        // Find the columns
        const activeColumn = columns.find((c) => c.tasks.some((t) => t.id === activeId))
        const overColumn = columns.find((c) => c.id === overId || c.tasks.some((t) => t.id === overId))

        if (!activeColumn || !overColumn) return

        if (activeColumn.id !== overColumn.id) {
            // Moving task to a different column
            setColumns((prev) => {
                const activeTasks = [...activeColumn.tasks]
                const overTasks = [...overColumn.tasks]

                const activeIndex = activeTasks.findIndex(t => t.id === activeId)
                const overIndex = overType === "Task"
                    ? overTasks.findIndex(t => t.id === overId)
                    // If dropping over a column area, drop at bottom
                    : overTasks.length

                // Remove from active
                const [movedTask] = activeTasks.splice(activeIndex, 1)

                // Add to over
                movedTask.columnId = overColumn.id
                overTasks.splice(overIndex >= 0 ? overIndex : overTasks.length, 0, movedTask)

                return prev.map(c => {
                    if (c.id === activeColumn.id) return { ...c, tasks: activeTasks }
                    if (c.id === overColumn.id) return { ...c, tasks: overTasks }
                    return c
                })
            })
        }
    }

    const onDragEnd = async (event: any) => {
        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return

        const activeType = active.data.current?.type

        if (activeType === "Column") {
            // Reorder columns
            const activeIdx = columns.findIndex((c) => c.id === activeId)
            const overIdx = columns.findIndex((c) => c.id === overId)

            const newlyOrderedColumns = arrayMove(columns, activeIdx, overIdx).map((c, i) => ({
                ...c,
                order: i * 1024
            }))

            setColumns(newlyOrderedColumns)

            await fetch("/api/kanban/columns", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ columns: newlyOrderedColumns.map(c => ({ id: c.id, order: c.order })) })
            })
        }

        if (activeType === "Task") {
            // Finding which column the task is currently sitting in after `onDragOver`
            const activeCol = columns.find(c => c.tasks.some(t => t.id === activeId))

            if (!activeCol) return

            const activeIdx = activeCol.tasks.findIndex(t => t.id === activeId)
            const overIdx = activeCol.tasks.findIndex(t => t.id === overId)

            // arrayMove is safe even if overIdx is not found
            const newlyOrderedTasks = arrayMove(activeCol.tasks, activeIdx, overIdx >= 0 ? overIdx : activeCol.tasks.length).map((t, i) => ({
                ...t,
                order: i * 1024,
                columnId: activeCol.id // Ensure columnId is synced
            }))

            setColumns(prevCols => prevCols.map(c =>
                c.id === activeCol.id ? { ...c, tasks: newlyOrderedTasks } : c
            ))

            // Bulk update tasks in DB
            await fetch("/api/kanban/tasks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tasks: newlyOrderedTasks.map(t => ({ id: t.id, order: t.order, columnId: t.columnId }))
                })
            })
        }
    }

    // Initialization check
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    if (!startupId) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">Please create a startup profile first</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center text-gray-100">
                        <GripVertical className="w-6 h-6 mr-3 text-orange-500" />
                        Kanban Board
                    </h1>
                    <p className="text-gray-400 mt-1">Manage tasks and track progress visually.</p>
                </div>

                <button
                    onClick={handleCreateColumn}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium shadow"
                >
                    <Plus className="w-4 h-4" />
                    Add List
                </button>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
                {columns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-[#1a1a1a] rounded-xl border border-dashed border-gray-700">
                        <h3 className="text-xl font-medium text-gray-200 mb-2">No lists found</h3>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Create your first list to start tracking tasks and progress for your startup. Good structures include "To Do", "In Progress", and "Done".
                        </p>
                        <button
                            onClick={handleCreateColumn}
                            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create First List
                        </button>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDragEnd={onDragEnd}
                    >
                        <div className="flex gap-6 h-full items-start">
                            <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                                {columns.map(column => (
                                    <SortableColumn
                                        key={column.id}
                                        column={column}
                                        onAddCard={handleCreateTask}
                                        onDeleteColumn={handleDeleteColumn}
                                        onUpdateColumn={handleUpdateColumn}
                                        onUpdateTask={handleUpdateTask}
                                        onDeleteTask={handleDeleteTask}
                                    />
                                ))}
                            </SortableContext>
                        </div>

                        <DragOverlay>
                            {activeColumn ? (
                                <div className="bg-[#1a1a1a] rounded-xl w-80 h-[500px] border-2 border-orange-500 shadow-xl opacity-90 scale-105 transition-transform">
                                    <div className="p-4 border-b border-gray-800 flex items-center justify-between opacity-50">
                                        <h3 className="font-semibold text-gray-100 uppercase tracking-wider text-sm">{activeColumn.title}</h3>
                                    </div>
                                </div>
                            ) : null}
                            {activeTask ? (
                                <div className="bg-[#242424] p-3 rounded-lg border-2 border-orange-500 shadow-xl opacity-90 scale-105 transition-transform text-sm group">
                                    <p className="text-gray-200 whitespace-pre-wrap">{activeTask.content}</p>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </div>
    )
}
