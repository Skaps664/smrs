import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data", "mvp-planning")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

function sanitizeEmail(email: string): string {
  return email.replace(/[^a-zA-Z0-9]/g, "_")
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureDataDir()
    const filename = `${sanitizeEmail(session.user.email)}.json`
    const filePath = path.join(DATA_DIR, filename)

    try {
      const data = await fs.readFile(filePath, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      // File doesn't exist yet
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error in GET /api/mvp-planning:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const newPlan = await request.json()
    newPlan.id = Date.now().toString()
    newPlan.lastUpdated = new Date().toISOString()

    await ensureDataDir()
    const filename = `${sanitizeEmail(session.user.email)}.json`
    const filePath = path.join(DATA_DIR, filename)

    let plans = []
    try {
      const data = await fs.readFile(filePath, "utf-8")
      plans = JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }

    plans.unshift(newPlan)
    await fs.writeFile(filePath, JSON.stringify(plans, null, 2))

    return NextResponse.json(newPlan)
  } catch (error) {
    console.error("Error in POST /api/mvp-planning:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedPlan = await request.json()
    updatedPlan.lastUpdated = new Date().toISOString()

    await ensureDataDir()
    const filename = `${sanitizeEmail(session.user.email)}.json`
    const filePath = path.join(DATA_DIR, filename)

    let plans = []
    try {
      const data = await fs.readFile(filePath, "utf-8")
      plans = JSON.parse(data)
    } catch (error) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    const index = plans.findIndex((p: any) => p.id === updatedPlan.id)
    if (index === -1) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    plans[index] = updatedPlan
    await fs.writeFile(filePath, JSON.stringify(plans, null, 2))

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error("Error in PUT /api/mvp-planning:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await ensureDataDir()
    const filename = `${sanitizeEmail(session.user.email)}.json`
    const filePath = path.join(DATA_DIR, filename)

    let plans = []
    try {
      const data = await fs.readFile(filePath, "utf-8")
      plans = JSON.parse(data)
    } catch (error) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    plans = plans.filter((p: any) => p.id !== id)
    await fs.writeFile(filePath, JSON.stringify(plans, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/mvp-planning:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
