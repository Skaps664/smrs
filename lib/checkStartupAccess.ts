import { prisma } from "./prisma"

/**
 * Check if a user has access to a startup (as owner, mentor, or investor)
 * @param startupId - The startup ID to check access for
 * @param userId - The user ID to check
 * @returns Object with access boolean and startup data if has access
 */
export async function checkStartupAccess(startupId: string, userId: string) {
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: {
      mentorAccess: true,
      investorAccess: true,
    },
  })

  if (!startup) {
    return { hasAccess: false, startup: null, accessType: null }
  }

  // Check access types
  const isOwner = startup.userId === userId
  const isMentor = startup.mentorAccess?.mentorId === userId
  const isInvestor = startup.investorAccess?.some((inv: { investorId: string }) => inv.investorId === userId)

  const hasAccess = isOwner || isMentor || isInvestor
  
  let accessType: 'OWNER' | 'MENTOR' | 'INVESTOR' | null = null
  if (isOwner) accessType = 'OWNER'
  else if (isMentor) accessType = 'MENTOR'
  else if (isInvestor) accessType = 'INVESTOR'

  return { hasAccess, startup, accessType }
}
