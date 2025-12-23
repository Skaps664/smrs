import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating existing feedback to mark as unread...')
  
  const result = await prisma.mentorFeedback.updateMany({
    where: {
      isRead: {
        equals: null as any, // Find feedback where isRead is not set
      },
    },
    data: {
      isRead: false,
      readAt: null,
    },
  })

  console.log(`Updated ${result.count} feedback items`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
