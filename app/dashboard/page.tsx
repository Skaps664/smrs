import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import fs from "fs/promises"
import path from "path"
import MentorsInvestorsSection from "@/components/MentorsInvestorsSection"
import { 
  Building2, 
  Calendar, 
  BarChart3, 
  Target, 
  FileText, 
  MessageSquare,
  Plus,
  TrendingUp,
  Lightbulb,
  Layers,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Rocket,
  BookOpen,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  MapPin,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Github,
  Info,
  PieChart,
  Shield,
  AlertTriangle
} from "lucide-react"

// Helper to load market research data
async function loadMarketResearch(userEmail: string) {
  try {
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, "_")
    const filePath = path.join(process.cwd(), "data", "market-research", `${sanitizedEmail}.json`)
    const data = await fs.readFile(filePath, "utf-8")
    const researches = JSON.parse(data)
    return researches.length > 0 ? researches[0] : null // Return most recent
  } catch {
    return null
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ startupId?: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Await the searchParams
  const params = await searchParams
  const startupIdParam = params.startupId

  // Get the user to check their role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  // If mentor/investor is viewing a specific startup (has startupId), allow them to view
  // Otherwise redirect them to their startups list
  if ((user?.role === "MENTOR" || user?.role === "INVESTOR") && !startupIdParam) {
    redirect("/dashboard/my-startups")
  }

  // Determine which startup to display
  let startups
  let currentStartup
  
  if (startupIdParam && (user?.role === "MENTOR" || user?.role === "INVESTOR")) {
    // Mentor/Investor viewing a specific startup
    const startup = await prisma.startup.findUnique({
      where: { id: startupIdParam },
      include: {
        weeklyTrackers: {
          orderBy: { createdAt: "desc" },
          take: 4,
        },
        monthlyTrackers: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        kpis: {
          orderBy: { date: "desc" },
          take: 10,
        },
        documents: true,
        mentorFeedback: {
          orderBy: { meetingDate: "desc" },
          take: 3,
        },
        valuePropositions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        teamMembers: {
          orderBy: { createdAt: "desc" },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    })

    if (!startup) {
      redirect("/dashboard/my-startups")
    }

    currentStartup = startup
    startups = [startup]
  } else {
    // Regular startup user viewing their own startups
    startups = await prisma.startup.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        weeklyTrackers: {
          orderBy: { createdAt: "desc" },
          take: 4,
        },
        monthlyTrackers: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        kpis: {
          orderBy: { date: "desc" },
          take: 10,
        },
        documents: true,
        mentorFeedback: {
          orderBy: { meetingDate: "desc" },
          take: 3,
        },
        valuePropositions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        teamMembers: {
          orderBy: { createdAt: "desc" },
        },
      },
    })
    currentStartup = startups[0]
  }

  const hasStartup = startups.length > 0

  // Load market research data - use founder's email for mentor/investor view
  const marketResearchEmail = currentStartup?.user?.email || session.user.email
  const marketResearch = marketResearchEmail ? await loadMarketResearch(marketResearchEmail) : null

  if (!hasStartup) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-8 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
          <p className="text-gray-400 mb-6">
            Let's get started by creating your startup profile.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Startup Profile
          </Link>
        </div>
      </div>
    )
  }

  // Calculate progress metrics
  const weeklyUpdateCount = currentStartup.weeklyTrackers?.length || 0
  const monthlyUpdateCount = currentStartup.monthlyTrackers?.length || 0
  const documentCount = currentStartup.documents?.length || 0
  const kpiCount = currentStartup.kpis?.length || 0
  const hasValueProp = (currentStartup.valuePropositions?.length || 0) > 0
  
  // Calculate completion percentage
  const totalTasks = 5 // Weekly, Monthly, KPI, Docs, Value Prop
  const completedTasks = [
    weeklyUpdateCount > 0,
    monthlyUpdateCount > 0,
    kpiCount > 0,
    documentCount > 0,
    hasValueProp,
  ].filter(Boolean).length
  const overallCompletion = Math.round((completedTasks / totalTasks) * 100)

  // Get KPI trends
  const recentKpis = currentStartup.kpis?.slice(0, 2) || []
  const kpiTrend = recentKpis.length === 2 
    ? (recentKpis[0].revenue || 0) > (recentKpis[1].revenue || 0) 
      ? 'up' 
      : 'down'
    : 'neutral'

  const stats = [
    {
      name: "Current Stage",
      value: currentStartup.stage.replace("_", " "),
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      description: "Startup lifecycle stage",
    },
    {
      name: "Weekly Updates",
      value: weeklyUpdateCount,
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-500/10",
      description: `${weeklyUpdateCount} updates logged`,
    },
    {
      name: "Documents",
      value: documentCount,
      icon: FileText,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      description: `${documentCount} files uploaded`,
    },
    {
      name: "KPI Records",
      value: kpiCount,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
      description: kpiTrend === 'up' ? '↑ Trending up' : kpiTrend === 'down' ? '↓ Needs attention' : '→ Stable',
      trend: kpiTrend,
    },
    {
      name: "Value Proposition",
      value: hasValueProp ? "Created" : "Pending",
      icon: Lightbulb,
      color: hasValueProp ? "text-orange-600" : "text-gray-400",
      bg: hasValueProp ? "bg-orange-500/10" : "bg-[#111]",
      description: hasValueProp ? "Defined and ready" : "Not created yet",
    },
    {
      name: "Overall Progress",
      value: `${overallCompletion}%`,
      icon: Rocket,
      color: overallCompletion > 60 ? "text-orange-600" : "text-yellow-600",
      bg: overallCompletion > 60 ? "bg-orange-500/10" : "bg-yellow-500/10",
      description: overallCompletion > 60 ? "Great progress!" : "Keep going!",
    },
  ]

  const isReadOnlyView = (user?.role === "MENTOR" || user?.role === "INVESTOR") && startupIdParam

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {isReadOnlyView ? `Viewing: ${currentStartup.name}` : `Welcome back, ${session.user.name}!`}
        </h1>
        <p className="text-orange-100">
          {isReadOnlyView 
            ? `Dashboard for ${currentStartup.user?.name || 'this startup'}`
            : `Here's what's happening with ${currentStartup.name}`
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-[#1a1a1a] rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    {stat.trend === 'up' && (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    )}
                    {stat.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <p className="text-xs text-gray-400">{stat.description}</p>
                  </div>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Market Research Insights */}
      {marketResearch && (
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl shadow-sm border-2 border-orange-500/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-orange-600" />
              Market Research Insights
            </h3>
            <Link
              href="/dashboard/market-research"
              className="text-sm text-orange-600 hover:text-orange-400 font-medium flex items-center"
            >
              View Full Research
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TAM/SAM/SOM Summary */}
            <div className="bg-[#1a1a1a] rounded-lg p-5 border border-orange-500/30">
              <h4 className="font-bold text-gray-100 mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                Market Size (TAM/SAM/SOM)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-orange-500/10 rounded">
                  <span className="text-sm font-medium text-gray-300">Total Addressable Market</span>
                  <span className="text-sm font-bold text-orange-600">
                    {marketResearch.tam?.currency || 'USD'} {(marketResearch.tam?.value || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-amber-500/10 rounded">
                  <span className="text-sm font-medium text-gray-300">Serviceable Available Market</span>
                  <span className="text-sm font-bold text-amber-600">
                    {marketResearch.sam?.currency || 'USD'} {(marketResearch.sam?.value || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded">
                  <span className="text-sm font-medium text-gray-300">Serviceable Obtainable Market</span>
                  <span className="text-sm font-bold text-yellow-400">
                    {marketResearch.som?.currency || 'USD'} {(marketResearch.som?.value || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* SWOT Summary */}
            <div className="bg-[#1a1a1a] rounded-lg p-5 border border-orange-500/30">
              <h4 className="font-bold text-gray-100 mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2 text-orange-600" />
                SWOT Analysis Highlights
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {marketResearch.swot?.strengths && marketResearch.swot.strengths.length > 0 && (
                  <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                      <p className="text-xs font-bold text-green-200">Strengths</p>
                    </div>
                    <p className="text-xs text-green-400">{marketResearch.swot.strengths.length} identified</p>
                  </div>
                )}
                {marketResearch.swot?.weaknesses && marketResearch.swot.weaknesses.length > 0 && (
                  <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-3 h-3 text-red-600 mr-1" />
                      <p className="text-xs font-bold text-red-200">Weaknesses</p>
                    </div>
                    <p className="text-xs text-red-400">{marketResearch.swot.weaknesses.length} identified</p>
                  </div>
                )}
                {marketResearch.swot?.opportunities && marketResearch.swot.opportunities.length > 0 && (
                  <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
                    <div className="flex items-center mb-2">
                      <Target className="w-3 h-3 text-blue-600 mr-1" />
                      <p className="text-xs font-bold text-blue-200">Opportunities</p>
                    </div>
                    <p className="text-xs text-blue-400">{marketResearch.swot.opportunities.length} identified</p>
                  </div>
                )}
                {marketResearch.swot?.threats && marketResearch.swot.threats.length > 0 && (
                  <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-600 mr-1" />
                      <p className="text-xs font-bold text-yellow-200">Threats</p>
                    </div>
                    <p className="text-xs text-yellow-400">{marketResearch.swot.threats.length} identified</p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Audience Summary */}
            {marketResearch.targetAudience && (
              <div className="bg-[#1a1a1a] rounded-lg p-5 border border-orange-500/30">
                <h4 className="font-bold text-gray-100 mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-orange-600" />
                  Target Audience
                </h4>
                <div className="space-y-2">
                  {marketResearch.targetAudience.segments && marketResearch.targetAudience.segments.length > 0 && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-300">Customer Segments:</p>
                        <p className="text-xs text-gray-400">{marketResearch.targetAudience.segments.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>
                  )}
                  {marketResearch.targetAudience.locations && marketResearch.targetAudience.locations.length > 0 && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-300">Geographic Focus:</p>
                        <p className="text-xs text-gray-400">{marketResearch.targetAudience.locations.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>
                  )}
                  {marketResearch.targetAudience.ageRanges && marketResearch.targetAudience.ageRanges.length > 0 && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-300">Age Ranges:</p>
                        <p className="text-xs text-gray-400">{marketResearch.targetAudience.ageRanges.join(", ")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Competitor Analysis Summary */}
            {marketResearch.competitorAnalysis && (
              <div className="bg-[#1a1a1a] rounded-lg p-5 border border-orange-500/30">
                <h4 className="font-bold text-gray-100 mb-4 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-orange-600" />
                  Competitive Landscape
                </h4>
                <div className="space-y-3">
                  {marketResearch.competitorAnalysis.directCompetitors && marketResearch.competitorAnalysis.directCompetitors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-300 mb-1">Direct Competitors:</p>
                      <p className="text-xs text-gray-400">{marketResearch.competitorAnalysis.directCompetitors.slice(0, 3).join(", ")}</p>
                    </div>
                  )}
                  {marketResearch.competitorAnalysis.marketGaps && marketResearch.competitorAnalysis.marketGaps.length > 0 && (
                    <div className="bg-green-500/10 p-2 rounded border border-green-500/30">
                      <p className="text-xs font-medium text-green-200 mb-1">Market Opportunities:</p>
                      <p className="text-xs text-green-400">{marketResearch.competitorAnalysis.marketGaps[0]}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {marketResearch.lastUpdated && (
            <div className="mt-4 pt-4 border-t border-orange-500/30">
              <p className="text-xs text-gray-400 text-center">
                Last updated: {new Date(marketResearch.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mentors & Investors Section */}
      <MentorsInvestorsSection startupId={currentStartup.id} />

      {/* Startup Details Card */}
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Info className="w-5 h-5 mr-2 text-orange-600" />
            Startup Details
          </h3>
          <Link
            href="/dashboard/profile"
            className="text-sm text-orange-600 hover:text-orange-400 font-medium flex items-center"
          >
            Edit Details
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Location Info */}
          {currentStartup.headquarters && (
            <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-orange-600 mr-2" />
                <h4 className="font-semibold text-gray-200">Headquarters</h4>
              </div>
              <p className="text-sm text-gray-400">{currentStartup.headquarters}</p>
            </div>
          )}

          {/* Operation Locations */}
          {currentStartup.operationLocations && currentStartup.operationLocations.length > 0 && (
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
              <div className="flex items-center mb-2">
                <Globe className="w-5 h-5 text-amber-600 mr-2" />
                <h4 className="font-semibold text-gray-200">Operations</h4>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                {currentStartup.operationLocations.slice(0, 3).map((location: string, i: number) => (
                  <p key={i}>• {location}</p>
                ))}
                {currentStartup.operationLocations.length > 3 && (
                  <p className="text-xs text-amber-600 font-medium">
                    +{currentStartup.operationLocations.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Team Count */}
          {currentStartup.teamMembers && currentStartup.teamMembers.length > 0 && (
            <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-gray-200">Team Members</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mb-1">
                {currentStartup.teamMembers.length}
              </p>
              <p className="text-xs text-gray-400">Active members</p>
            </div>
          )}

          {/* Social Media Links */}
          {currentStartup.socialMediaLinks && Object.values(currentStartup.socialMediaLinks as any).some((link: any) => link) && (
            <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
              <div className="flex items-center mb-3">
                <Globe className="w-5 h-5 text-orange-600 mr-2" />
                <h4 className="font-semibold text-gray-200">Social Media</h4>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(currentStartup.socialMediaLinks as any).linkedin && (
                  <a
                    href={(currentStartup.socialMediaLinks as any).linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {(currentStartup.socialMediaLinks as any).twitter && (
                  <a
                    href={(currentStartup.socialMediaLinks as any).twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {(currentStartup.socialMediaLinks as any).facebook && (
                  <a
                    href={(currentStartup.socialMediaLinks as any).facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {(currentStartup.socialMediaLinks as any).instagram && (
                  <a
                    href={(currentStartup.socialMediaLinks as any).instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {(currentStartup.socialMediaLinks as any).youtube && (
                  <a
                    href={(currentStartup.socialMediaLinks as any).youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tips & Tricks Count */}
          {currentStartup.tipsAndTricks && currentStartup.tipsAndTricks.length > 0 && (
            <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-center mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-gray-200">Tips & Tricks</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mb-1">
                {currentStartup.tipsAndTricks.length}
              </p>
              <p className="text-xs text-gray-400">Saved insights</p>
            </div>
          )}

          {/* Contact Info */}
          {(currentStartup.email || currentStartup.phone) && (
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 text-amber-600 mr-2" />
                <h4 className="font-semibold text-gray-200">Contact</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                {currentStartup.email && (
                  <p className="flex items-center">
                    <Mail className="w-3 h-3 mr-2" />
                    {currentStartup.email}
                  </p>
                )}
                {currentStartup.phone && (
                  <p className="flex items-center">
                    <Phone className="w-3 h-3 mr-2" />
                    {currentStartup.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Rocket className="w-5 h-5 mr-2 text-orange-600" />
          Startup Progress Overview
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm font-bold text-orange-600">{overallCompletion}%</span>
            </div>
            <div className="w-full bg-[#1f1f1f] rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallCompletion}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center">
              {weeklyUpdateCount > 0 ? (
                <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className="text-sm">Weekly Updates ({weeklyUpdateCount})</span>
            </div>
            <div className="flex items-center">
              {monthlyUpdateCount > 0 ? (
                <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className="text-sm">Monthly Updates ({monthlyUpdateCount})</span>
            </div>
            <div className="flex items-center">
              {kpiCount > 0 ? (
                <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className="text-sm">KPIs Tracked ({kpiCount})</span>
            </div>
            <div className="flex items-center">
              {documentCount > 0 ? (
                <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className="text-sm">Documents ({documentCount})</span>
            </div>
            <div className="flex items-center">
              {hasValueProp ? (
                <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className="text-sm">Value Proposition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/value-proposition"
            className="flex items-center p-4 border-2 border-gray-700 rounded-lg hover:border-orange-500 hover:bg-orange-500/10 transition-all group"
          >
            <Lightbulb className="w-8 h-8 text-orange-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold">Value Proposition</p>
              <p className="text-sm text-gray-400">Define your unique value</p>
            </div>
          </Link>

          <Link
            href="/dashboard/business-model"
            className="flex items-center p-4 border-2 border-gray-700 rounded-lg hover:border-amber-500 hover:bg-amber-500/10 transition-all group"
          >
            <Layers className="w-8 h-8 text-amber-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold">Business Model</p>
              <p className="text-sm text-gray-400">Build your canvas</p>
            </div>
          </Link>

          <Link
            href="/dashboard/weekly"
            className="flex items-center p-4 border-2 border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all group"
          >
            <Calendar className="w-8 h-8 text-blue-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold">Log Weekly Update</p>
              <p className="text-sm text-gray-400">Track this week's progress</p>
            </div>
          </Link>

          <Link
            href="/dashboard/kpis"
            className="flex items-center p-4 border-2 border-gray-700 rounded-lg hover:border-green-500 hover:bg-green-500/10 transition-all group"
          >
            <BarChart3 className="w-8 h-8 text-green-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold">Update KPIs</p>
              <p className="text-sm text-gray-400">Record key metrics</p>
            </div>
          </Link>

          <Link
            href="/dashboard/documents"
            className="flex items-center p-4 border-2 border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all group"
          >
            <FileText className="w-8 h-8 text-purple-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold">Upload Document</p>
              <p className="text-sm text-gray-400">Add certificates or files</p>
            </div>
          </Link>

          <Link
            href="/dashboard/mentor"
            className="flex items-center p-4 border-2 border-gray-700 rounded-lg hover:border-orange-500 hover:bg-orange-500/10 transition-all group"
          >
            <Users className="w-8 h-8 text-orange-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold">Mentor Feedback</p>
              <p className="text-sm text-gray-400">Get expert guidance</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Weekly Update */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Latest Weekly Update
          </h3>
          {currentStartup.weeklyTrackers?.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Week {currentStartup.weeklyTrackers[0].weekNumber}
                </p>
                <p className="text-xs text-gray-400">
                  {currentStartup.weeklyTrackers[0].month} {currentStartup.weeklyTrackers[0].year}
                </p>
              </div>
              {currentStartup.weeklyTrackers[0].milestonesAchieved?.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    Milestones Achieved:
                  </p>
                  <ul className="space-y-1">
                    {currentStartup.weeklyTrackers[0].milestonesAchieved.slice(0, 3).map((milestone: string, i: number) => (
                      <li key={i} className="text-sm text-gray-400 pl-5 relative">
                        <span className="absolute left-0">•</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                  {currentStartup.weeklyTrackers[0].milestonesAchieved.length > 3 && (
                    <p className="text-xs text-gray-400 mt-2">
                      +{currentStartup.weeklyTrackers[0].milestonesAchieved.length - 3} more
                    </p>
                  )}
                </div>
              )}
              {currentStartup.weeklyTrackers[0].challenges?.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="font-medium text-sm mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1 text-orange-500" />
                    Challenges:
                  </p>
                  <p className="text-sm text-gray-400">{currentStartup.weeklyTrackers[0].challenges[0]}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No weekly updates yet</p>
              <Link 
                href="/dashboard/weekly"
                className="text-blue-600 hover:text-blue-400 text-sm font-medium mt-2 inline-block"
              >
                Create your first update →
              </Link>
            </div>
          )}
        </div>

        {/* Latest Mentor Feedback */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
            Latest Mentor Feedback
          </h3>
          {currentStartup.mentorFeedback?.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <p className="text-sm font-medium">{currentStartup.mentorFeedback[0].mentorName}</p>
                </div>
                {currentStartup.mentorFeedback[0].progressScore && (
                  <div className="flex items-center bg-indigo-500/10 px-2 py-1 rounded">
                    <BarChart3 className="w-3 h-3 mr-1 text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-600">
                      {currentStartup.mentorFeedback[0].progressScore}/10
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-300 bg-[#111] p-3 rounded-lg">
                "{currentStartup.mentorFeedback[0].feedback}"
              </p>
              {currentStartup.mentorFeedback[0].assignedTasks?.length > 0 && (
                <div className="pt-2">
                  <p className="font-medium text-sm mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-1 text-blue-500" />
                    Action Items:
                  </p>
                  <ul className="space-y-1">
                    {currentStartup.mentorFeedback[0].assignedTasks.slice(0, 2).map((item: string, i: number) => (
                      <li key={i} className="text-sm text-gray-400 pl-5 relative">
                        <span className="absolute left-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No mentor feedback yet</p>
              <Link 
                href="/dashboard/mentor"
                className="text-purple-600 hover:text-purple-400 text-sm font-medium mt-2 inline-block"
              >
                Request feedback →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent KPIs & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent KPIs */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
            Recent KPIs
          </h3>
          {currentStartup.kpis?.length > 0 ? (
            <div className="space-y-3">
              {currentStartup.kpis.slice(0, 5).map((kpi, index) => {
                // Extract the first non-null metric value
                const metricValue = kpi.revenue || kpi.ordersPlaced || kpi.unitsSold || kpi.socialFollowers || kpi.leadsGenerated || kpi.featuresCompleted || kpi.employeesAdded || 0;
                const metricName = kpi.category.replace('_', ' ');
                
                return (
                  <div key={kpi.id} className="flex items-center justify-between p-3 bg-[#111] rounded-lg hover:bg-[#141414] transition-colors">
                    <div className="flex items-center flex-1">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        'bg-gray-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{metricName}</p>
                        <p className="text-xs text-gray-400">{new Date(kpi.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{metricValue}</p>
                      {kpi.notes && (
                        <p className="text-xs text-gray-400 truncate max-w-[100px]">{kpi.notes}</p>
                      )}
                    </div>
                  </div>
                )
              })}
              {currentStartup.kpis.length > 5 && (
                <Link 
                  href="/dashboard/kpis"
                  className="block text-center text-sm text-blue-600 hover:text-blue-400 font-medium pt-2"
                >
                  View all {currentStartup.kpis.length} KPIs →
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No KPIs tracked yet</p>
              <Link 
                href="/dashboard/kpis"
                className="text-green-600 hover:text-green-400 text-sm font-medium mt-2 inline-block"
              >
                Add your first KPI →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Documents */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            Recent Documents
          </h3>
          {currentStartup.documents?.length > 0 ? (
            <div className="space-y-3">
              {currentStartup.documents.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-[#111] rounded-lg hover:bg-[#141414] transition-colors">
                  <div className="flex items-center flex-1">
                    <FileText className="w-4 h-4 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{doc.name}</p>
                      <p className="text-xs text-gray-400">{doc.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {currentStartup.documents.length > 5 && (
                <Link 
                  href="/dashboard/documents"
                  className="block text-center text-sm text-blue-600 hover:text-blue-400 font-medium pt-2"
                >
                  View all {currentStartup.documents.length} documents →
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No documents uploaded yet</p>
              <Link 
                href="/dashboard/documents"
                className="text-purple-600 hover:text-purple-400 text-sm font-medium mt-2 inline-block"
              >
                Upload your first document →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Business Planning Status */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg shadow-sm p-6 border border-indigo-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
          Business Planning Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Lightbulb className="w-5 h-5 text-pink-500 mr-2" />
                <p className="font-medium">Value Proposition</p>
              </div>
              {hasValueProp ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <p className="text-sm text-gray-400 mb-3">
              {hasValueProp 
                ? "Your value proposition has been defined. Keep it updated as you iterate."
                : "Define what makes your startup unique and valuable to customers."
              }
            </p>
            <Link
              href="/dashboard/value-proposition"
              className={`block text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                hasValueProp 
                  ? 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/20'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {hasValueProp ? 'Review & Update' : 'Create Now'}
            </Link>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Layers className="w-5 h-5 text-indigo-500 mr-2" />
                <p className="font-medium">Business Model Canvas</p>
              </div>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Map out your complete business model with all 9 building blocks.
            </p>
            <Link
              href="/dashboard/business-model"
              className="block text-center py-2 px-4 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              Open Canvas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
