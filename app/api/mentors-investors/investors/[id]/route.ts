import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.startupInvestorAccess.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Investor removed successfully" })
  } catch (error) {
    console.error("Error removing investor:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
