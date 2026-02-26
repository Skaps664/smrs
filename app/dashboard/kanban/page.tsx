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
import { Plus, X, Loader2, GripVertical, CheckCircle, Circle, Edit2, Trash2, Info, GripHorizontal } from "lucide-react"

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
                className="bg-[#111]/40 backdrop-blur-md rounded-2xl flex-shrink-0 w-[320px] h-[500px] border-2 border-dashed border-orange-500/50 opacity-60"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl flex-shrink-0 w-[320px] max-h-[calc(100vh-250px)] flex flex-col border border-white/5 shadow-2xl transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
        >
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                className="p-4 rounded-t-2xl bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5 flex items-center justify-between cursor-grab active:cursor-grabbing group relative overflow-hidden"
            >
                {/* Subtle top glare */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="flex items-center gap-3 flex-1 relative z-10">
                    <GripHorizontal className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    {isEditingTitle ? (
                        <input
                            type="text"
                            className="bg-[#1a1a1a] text-gray-100 text-sm font-semibold px-3 py-1.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-white/10 shadow-inner"
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
                            className="font-bold text-gray-100 tracking-wide text-sm flex-1 truncate select-none shadow-black drop-shadow-md"
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                                setIsEditingTitle(true)
                            }}
                        >
                            {column.title}
                        </h3>
                    )}
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                        {column.tasks.length}
                    </span>
                </div>

                <button
                    onClick={() => onDeleteColumn(column.id)}
                    onPointerDown={(e) => e.stopPropagation()} // prevent drag
                    className="relative z-10 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/10 rounded-md cursor-pointer"
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
            <div className="p-3 pb-4">
                {isAdding ? (
                    <div className="bg-[#151515] p-3 rounded-xl border border-white/10 shadow-inner translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        <textarea
                            autoFocus
                            placeholder="What needs to be done?"
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            className="w-full bg-transparent text-gray-200 text-sm outline-none resize-none h-16 placeholder:text-gray-600"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleAddCard()
                                }
                            }}
                        />
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                            <button
                                onClick={handleAddCard}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium text-xs px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95"
                            >
                                Save Task
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false)
                                    setNewTaskContent("")
                                }}
                                className="text-gray-500 hover:text-gray-300 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/5 border border-transparent hover:border-orange-500/10 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:scale-110 group-active:scale-90" />
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
                className="bg-orange-500/5 border-2 border-dashed border-orange-500/50 rounded-xl h-24 opacity-60 backdrop-blur-sm"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group relative p-4 rounded-xl border-t border-l border-white/5 shadow-md shadow-black/20 cursor-grab active:cursor-grabbing flex gap-3 items-start transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 ${task.isCompleted
                    ? "bg-green-500/5 border-r border-b border-green-500/10 text-gray-500 hover:border-green-500/30"
                    : "bg-gradient-to-br from-[#1a1a1a] to-[#141414] border-r border-b border-black/40 hover:border-orange-500/30 text-gray-200"
                }`}
        >
            <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            <button
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag while clicking
                onClick={() => onUpdate(task, { isCompleted: !task.isCompleted })}
                className={`flex-shrink-0 mt-0.5 p-1 -ml-1 rounded-md transition-all cursor-pointer ${task.isCompleted
                        ? "text-green-500 hover:text-green-400 hover:bg-green-500/10"
                        : "text-gray-600 hover:text-orange-500 hover:bg-orange-500/10"
                    }`}
            >
                {task.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </button>

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <textarea
                        autoFocus
                        className="w-full bg-[#0a0a0a] text-gray-100 text-sm outline-none resize-none rounded-lg p-3 focus:ring-2 focus:ring-orange-500/50 border border-white/10 shadow-inner min-h-[80px]"
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
                        className={`text-sm leading-relaxed whitespace-pre-wrap select-none transition-colors cursor-text ${task.isCompleted ? "line-through text-gray-500" : "text-gray-300 group-hover:text-gray-100"
                            }`}
                        onDoubleClick={(e) => {
                            e.stopPropagation()
                            setIsEditing(true)
                        }}
                    >
                        {task.content}
                    </p>
                )}
            </div>

            {/* Quick Actions overlay on hover */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 scale-95 origin-top-right group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-[#0a0a0a]/80 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-2xl">
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 p-1.5 rounded-md transition-colors cursor-pointer"
                    title="Edit Task"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-full h-px bg-white/10 my-0.5"></div>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onDelete(task.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-md transition-colors cursor-pointer"
                    title="Delete Task"
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
        const title = prompt("Enter list name (e.g., Backlog, Doing, Done):")
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
        if (!confirm("Are you sure you want to delete this list and all its tasks?")) return
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

        // Optimistic UI
        const optimisticId = Math.random().toString()
        const newTask: KanbanTask = {
            id: optimisticId,
            columnId,
            content,
            order,
            isCompleted: false
        }

        setColumns(cols => cols.map(c =>
            c.id === columnId ? { ...c, tasks: [...c.tasks, newTask] } : c
        ))

        const res = await fetch("/api/kanban/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ columnId, content, order })
        })
        if (res.ok) fetchData()
    }

    const handleUpdateTask = async (task: KanbanTask, updates: any) => {
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
                distance: 5,
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

        const activeColumn = columns.find((c) => c.tasks.some((t) => t.id === activeId))
        const overColumn = columns.find((c) => c.id === overId || c.tasks.some((t) => t.id === overId))

        if (!activeColumn || !overColumn) return

        if (activeColumn.id !== overColumn.id) {
            setColumns((prev) => {
                const activeTasks = [...activeColumn.tasks]
                const overTasks = [...overColumn.tasks]

                const activeIndex = activeTasks.findIndex(t => t.id === activeId)
                const overIndex = overType === "Task"
                    ? overTasks.findIndex(t => t.id === overId)
                    : overTasks.length

                const [movedTask] = activeTasks.splice(activeIndex, 1)

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
            const activeCol = columns.find(c => c.tasks.some(t => t.id === activeId))

            if (!activeCol) return

            const activeIdx = activeCol.tasks.findIndex(t => t.id === activeId)
            const overIdx = activeCol.tasks.findIndex(t => t.id === overId)

            const newlyOrderedTasks = arrayMove(activeCol.tasks, activeIdx, overIdx >= 0 ? overIdx : activeCol.tasks.length).map((t, i) => ({
                ...t,
                order: i * 1024,
                columnId: activeCol.id
            }))

            setColumns(prevCols => prevCols.map(c =>
                c.id === activeCol.id ? { ...c, tasks: newlyOrderedTasks } : c
            ))

            await fetch("/api/kanban/tasks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tasks: newlyOrderedTasks.map(t => ({ id: t.id, order: t.order, columnId: t.columnId }))
                })
            })
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
                <p className="text-gray-400 font-medium animate-pulse">Loading workspace...</p>
            </div>
        )
    }

    if (!startupId) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center max-w-md mx-auto px-4">
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 border border-orange-500/20">
                    <GripVertical className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Welcome to Kanban</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    You need to create a Startup Profile first before managing your dynamic task board. Go to My Startups and set everything up!
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold flex items-center text-white drop-shadow-sm">
                        <div className="p-2 bg-orange-500/10 rounded-lg mr-3 border border-orange-500/20">
                            <GripVertical className="w-6 h-6 text-orange-500" />
                        </div>
                        Sprint Board
                    </h1>
                    <p className="text-gray-400 mt-2 ml-14 text-sm font-medium tracking-wide">Visualize your workflow and hit your milestones.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-white/5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sync Active</span>
                    </div>
                    <button
                        onClick={handleCreateColumn}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 font-semibold tracking-wide border border-orange-500/50 shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        New List
                    </button>
                </div>
            </div>

            {/* Premium Onboarding Callout */}
            <div className="my-6 bg-gradient-to-r from-[#111111]/80 to-[#0a0a0a]/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-2xl shadow-black/40 flex flex-col md:flex-row items-start md:items-center gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute inset-px rounded-[15px] border border-white/[0.02]"></div>

                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-xl text-orange-400 border border-orange-500/20 shadow-inner">
                    <Info className="w-6 h-6" />
                </div>

                <div className="flex-1 relative z-10 w-full">
                    <h3 className="text-base font-bold text-gray-100 mb-3">How to use your interactive board</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400">
                        <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                            <Plus className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-gray-200">Create Lists:</strong> Add columns to match your sprint workflow.</p>
                        </div>
                        <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                            <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-gray-200">Add Tasks:</strong> Click "Add Task" at the bottom of any list to start tracking.</p>
                        </div>
                        <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                            <GripHorizontal className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-gray-200">Reorganize:</strong> Drag and drop tasks seamlessly across the board.</p>
                        </div>
                        <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                            <Edit2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p><strong className="text-gray-200">Quick Edit:</strong> Double-click any title or task to rename it instantly.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board Area */}
            <div className="flex-1 overflow-x-auto custom-scrollbar pb-6">
                {columns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-[#0a0a0a]/50 rounded-3xl border-2 border-dashed border-white/10 max-w-2xl mx-auto backdrop-blur-sm mt-8">
                        <div className="w-24 h-24 mb-6 relative">
                            <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full"></div>
                            <div className="relative w-full h-full bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center rotate-3 hover:rotate-6 transition-transform">
                                <Plus className="w-10 h-10 text-orange-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-3 drop-shadow-md">Blank Canvas</h3>
                        <p className="text-gray-400 max-w-md mb-8 leading-relaxed text-sm">
                            Create your first list to start tracking tasks and progress for your startup. Structure it however fits your team best—like "To Do", "In Progress", and "Done".
                        </p>
                        <button
                            onClick={handleCreateColumn}
                            className="bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 font-bold shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                            Initialize Board
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
                        <div className="flex gap-6 h-full items-start pl-2">
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

                            {/* Ghost column to allow pushing new columns easily to the right */}
                            <div className="flex-shrink-0 w-[320px] h-[100px] border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group" onClick={handleCreateColumn}>
                                <div className="text-gray-500 group-hover:text-amber-500 flex items-center gap-2 font-medium">
                                    <Plus className="w-5 h-5" />
                                    Add another list
                                </div>
                            </div>
                        </div>

                        <DragOverlay>
                            {activeColumn ? (
                                <div className="bg-[#111111]/90 backdrop-blur-xl rounded-2xl w-[320px] max-h-[500px] border border-orange-500/50 shadow-2xl shadow-orange-500/10 opacity-95 scale-[1.02] transition-transform overflow-hidden cursor-grabbing">
                                    <div className="p-4 bg-gradient-to-b from-orange-500/10 to-transparent border-b border-white/5 flex items-center gap-3">
                                        <GripHorizontal className="w-4 h-4 text-orange-500" />
                                        <h3 className="font-bold text-gray-100 tracking-wide text-sm">{activeColumn.title}</h3>
                                    </div>
                                    <div className="p-3 opacity-30">
                                        <div className="w-full h-20 bg-[#222] rounded-xl mb-3"></div>
                                        <div className="w-full h-16 bg-[#222] rounded-xl mb-3"></div>
                                        <div className="w-full h-24 bg-[#222] rounded-xl"></div>
                                    </div>
                                </div>
                            ) : null}
                            {activeTask ? (
                                <div className="bg-[#1c1c1c] p-4 rounded-xl border border-orange-500/50 shadow-2xl shadow-orange-500/20 opacity-95 scale-[1.03] transition-transform text-sm flex items-start gap-3 cursor-grabbing">
                                    <Circle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">{activeTask.content}</p>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </div>
    )
}
