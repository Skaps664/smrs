import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
  Building2, 
  Calendar, 
  BarChart3, 
  Target, 
  FileText, 
  MessageSquare,
  Plus,
  TrendingUp
} from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Get user's startups
  const startups = await prisma.startup.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      weeklyTrackers: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      monthlyTrackers: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      kpis: {
        orderBy: { date: "desc" },
        take: 5,
      },
      documents: true,
      mentorFeedback: {
        orderBy: { meetingDate: "desc" },
        take: 1,
      },
    },
  })

  const hasStartup = startups.length > 0
  const currentStartup = startups[0]

  if (!hasStartup) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
          <p className="text-gray-600 mb-6">
            Let's get started by creating your startup profile.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Startup Profile
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: "Current Stage",
      value: currentStartup.stage.replace("_", " "),
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Weekly Updates",
      value: currentStartup.weeklyTrackers.length,
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      name: "Documents",
      value: currentStartup.documents.length,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      name: "KPI Records",
      value: currentStartup.kpis.length,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
        <p className="text-blue-100">Here's what's happening with {currentStartup.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/weekly"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Calendar className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="font-semibold">Log Weekly Update</p>
              <p className="text-sm text-gray-600">Track this week's progress</p>
            </div>
          </Link>

          <Link
            href="/dashboard/kpis"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <BarChart3 className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <p className="font-semibold">Update KPIs</p>
              <p className="text-sm text-gray-600">Record key metrics</p>
            </div>
          </Link>

          <Link
            href="/dashboard/documents"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <FileText className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <p className="font-semibold">Upload Document</p>
              <p className="text-sm text-gray-600">Add certificates or files</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Weekly Update */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Weekly Update</h3>
          {currentStartup.weeklyTrackers.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Week {currentStartup.weeklyTrackers[0].weekNumber} - {currentStartup.weeklyTrackers[0].month} {currentStartup.weeklyTrackers[0].year}
              </p>
              {currentStartup.weeklyTrackers[0].milestonesAchieved.length > 0 && (
                <div>
                  <p className="font-medium text-sm">Milestones:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {currentStartup.weeklyTrackers[0].milestonesAchieved.slice(0, 3).map((milestone: string, i: number) => (
                      <li key={i}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No weekly updates yet</p>
          )}
        </div>

        {/* Latest Mentor Feedback */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Latest Mentor Feedback
          </h3>
          {currentStartup.mentorFeedback.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                From: {currentStartup.mentorFeedback[0].mentorName}
              </p>
              <p className="text-sm line-clamp-3">{currentStartup.mentorFeedback[0].feedback}</p>
              {currentStartup.mentorFeedback[0].progressScore && (
                <p className="text-sm font-medium">
                  Progress Score: {currentStartup.mentorFeedback[0].progressScore}/10
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No mentor feedback yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
