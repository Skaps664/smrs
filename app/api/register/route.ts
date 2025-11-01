import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      name, 
      role = 'STARTUP',
      phone,
      currentStage,
      mentorCompany,
      mentorLinkedin,
      mentorLocation,
      investorPortfolio,
      investorLocation
    } = body

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate role-specific fields
    if (role === 'STARTUP' && !currentStage) {
      return NextResponse.json(
        { error: "Current stage is required for startup founders" },
        { status: 400 }
      )
    }

    if (role === 'MENTOR' && (!mentorCompany || !mentorLocation)) {
      return NextResponse.json(
        { error: "Company and location are required for mentors" },
        { status: 400 }
      )
    }

    if (role === 'INVESTOR' && !investorLocation) {
      return NextResponse.json(
        { error: "Location is required for investors" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const userData: any = {
      email,
      password: hashedPassword,
      name,
      role,
      phone,
    }

    // Add role-specific fields
    if (role === 'STARTUP') {
      userData.currentStage = currentStage
    } else if (role === 'MENTOR') {
      userData.mentorCompany = mentorCompany
      userData.mentorLinkedin = mentorLinkedin
      userData.mentorLocation = mentorLocation
    } else if (role === 'INVESTOR') {
      userData.investorPortfolio = investorPortfolio
      userData.investorLocation = investorLocation
    }

    const user = await prisma.user.create({
      data: userData
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id, role: user.role },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
