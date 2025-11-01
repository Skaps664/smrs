import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data", "market-research")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Get user-specific file path
async function getUserFilePath() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }
  const sanitizedEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_")
  return path.join(DATA_DIR, `${sanitizedEmail}.json`)
}

// GET - Load all market researches for user
export async function GET() {
  try {
    await ensureDataDir()
    const filePath = await getUserFilePath()
    
    try {
      const data = await fs.readFile(filePath, "utf-8")
      const researches = JSON.parse(data)
      return NextResponse.json(researches)
    } catch {
      // File doesn't exist yet
      return NextResponse.json([])
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new market research
export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()
    const filePath = await getUserFilePath()
    const newResearch = await request.json()
    
    // Generate ID
    newResearch.id = Date.now().toString()
    
    // Load existing researches
    let researches = []
    try {
      const data = await fs.readFile(filePath, "utf-8")
      researches = JSON.parse(data)
    } catch {
      // File doesn't exist yet
    }
    
    // Add new research
    researches.push(newResearch)
    
    // Save
    await fs.writeFile(filePath, JSON.stringify(researches, null, 2))
    
    return NextResponse.json(newResearch)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update existing market research
export async function PUT(request: NextRequest) {
  try {
    await ensureDataDir()
    const filePath = await getUserFilePath()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const updatedResearch = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    
    // Load existing researches
    const data = await fs.readFile(filePath, "utf-8")
    let researches = JSON.parse(data)
    
    // Update research
    const index = researches.findIndex((r: any) => r.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Research not found" }, { status: 404 })
    }
    
    researches[index] = { ...updatedResearch, id }
    
    // Save
    await fs.writeFile(filePath, JSON.stringify(researches, null, 2))
    
    return NextResponse.json(researches[index])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete market research
export async function DELETE(request: NextRequest) {
  try {
    await ensureDataDir()
    const filePath = await getUserFilePath()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    
    // Load existing researches
    const data = await fs.readFile(filePath, "utf-8")
    let researches = JSON.parse(data)
    
    // Remove research
    researches = researches.filter((r: any) => r.id !== id)
    
    // Save
    await fs.writeFile(filePath, JSON.stringify(researches, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
