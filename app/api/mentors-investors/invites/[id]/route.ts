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

    await prisma.inviteLink.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Invite revoked successfully" })
  } catch (error) {
    console.error("Error revoking invite:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
