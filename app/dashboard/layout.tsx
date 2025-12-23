"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  BarChart3, 
  Target, 
  FileText, 
  MessageSquare, 
  FileDown,
  Lightbulb,
  Layers,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Rocket,
  Users,
  Settings
} from "lucide-react"
import { useState, useEffect } from "react"
import { ReadOnlyProvider } from "@/contexts/ReadOnlyContext"
import ReadOnlyBanner from "@/components/ReadOnlyBanner"
import { useFeedbackUnreadCount } from "@/hooks/useFeedbackUnreadCount"
import { DashboardWrapper } from "@/components/dashboard-wrapper"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Startup Profile", href: "/dashboard/profile", icon: Building2 },
  { name: "Weekly Tracker", href: "/dashboard/weekly", icon: Calendar },
  { name: "Monthly Tracker", href: "/dashboard/monthly", icon: Calendar },
  { name: "KPI Dashboard", href: "/dashboard/kpis", icon: BarChart3 },
  { name: "Timeline", href: "/dashboard/timeline", icon: Target },
  { name: "Market Research", href: "/dashboard/market-research", icon: TrendingUp },
  { name: "MVP Planning", href: "/dashboard/mvp-planning", icon: Rocket },
  { name: "Value Proposition", href: "/dashboard/value-proposition", icon: Lightbulb },
  { name: "Business Model", href: "/dashboard/business-model", icon: Layers },
  { name: "Mentors & Investors", href: "/dashboard/mentors-investors", icon: Users },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Mentor Feedback", href: "/dashboard/feedback", icon: MessageSquare },
  { name: "Reports", href: "/dashboard/reports", icon: FileDown },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ownStartupId, setOwnStartupId] = useState<string | null>(null)

  const userRole = (session?.user as any)?.role
  const startupId = searchParams.get("startupId")
  const isViewingStartup = (userRole === "MENTOR" || userRole === "INVESTOR") && startupId

  // Get unread count for current startup (either own or viewing)
  const currentStartupId = isViewingStartup ? startupId : ownStartupId
  const shouldFetchUnread = !!(userRole === "STARTUP" || isViewingStartup)
  const { unreadCount } = useFeedbackUnreadCount(currentStartupId, shouldFetchUnread)

  // Fetch own startup ID if user is STARTUP role
  useEffect(() => {
    if (userRole === "STARTUP" && !ownStartupId) {
      fetch("/api/startup")
        .then(res => res.json())
        .then(data => {
          const startup = Array.isArray(data) ? data[0] : data
          if (startup?.id) setOwnStartupId(startup.id)
        })
        .catch(console.error)
    }
  }, [userRole, ownStartupId])

  // Mentor/Investor's own navigation
  const mentorNavigation = [
    { name: "My Startups", href: "/dashboard/my-startups", icon: Building2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <DashboardWrapper>
      <ReadOnlyProvider>
        <div className="min-h-screen bg-[#0a0a0a]">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {isViewingStartup ? (
          // Nested layout for mentor/investor viewing startup
          <>
            {/* Mentor's Sidebar (Left) */}
            <aside className="fixed inset-y-0 left-0 z-30 w-56 bg-[#141414] border-r border-gray-800 text-gray-100">
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center h-16 px-6 border-b border-gray-800">
                  <h1 className="text-xl font-bold">My Panel</h1>
                </div>

                {/* Mentor Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {mentorNavigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-orange-500 transition-colors"
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-gray-800" suppressHydrationWarning>
                  <div className="mb-3" suppressHydrationWarning>
                    <p className="text-sm font-medium text-gray-100">{session?.user?.name}</p>
                    <p className="text-xs text-gray-400">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium bg-gray-800 hover:bg-red-600 text-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>

            {/* Startup's Sidebar (Right of Mentor's) */}
            <aside className="fixed inset-y-0 left-56 z-20 w-64 bg-[#1a1a1a] border-r border-gray-800">
              <div className="flex flex-col h-full">
                {/* Startup Header */}
                <div className="h-16 px-6 border-b border-gray-800 bg-orange-500/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-orange-500">Viewing Startup</h2>
                    <p className="text-xs text-gray-400">Read-Only Mode</p>
                  </div>
                </div>

                {/* Startup Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    const href = `${item.href}?startupId=${startupId}`
                    const showBadge = item.name === "Mentor Feedback" && unreadCount > 0
                    return (
                      <Link
                        key={item.name}
                        href={href}
                        className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? "bg-orange-500/20 text-orange-500 border-l-4 border-orange-500"
                            : "text-gray-300 hover:bg-gray-800 hover:text-orange-500"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </div>
                        {showBadge && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-600 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </aside>

            {/* Main content for viewing mode */}
            <div className="lg:pl-[480px]">
              {/* Read-only banner */}
              <ReadOnlyBanner />
              
              {/* Top bar */}
              <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-[#141414] border-b border-gray-800 lg:px-8">
                <h2 className="text-lg font-semibold text-gray-100">
                  {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
                </h2>
              </header>

              {/* Page content */}
              <main className="p-4 lg:p-8">{children}</main>
            </div>
          </>
        ) : (
          // Normal layout for startup users or mentor/investor without viewing
          <>
            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#141414] border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
                  <h1 className="text-xl font-bold text-orange-500">eazstart</h1>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {(userRole === "MENTOR" || userRole === "INVESTOR" ? mentorNavigation : navigation).map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    const showBadge = item.name === "Mentor Feedback" && unreadCount > 0
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? "bg-orange-500/20 text-orange-500 border-l-4 border-orange-500"
                            : "text-gray-300 hover:bg-gray-800 hover:text-orange-500"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </div>
                        {showBadge && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-600 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-gray-800" suppressHydrationWarning>
                  <div className="flex items-center mb-3" suppressHydrationWarning>
                    <div className="flex-1" suppressHydrationWarning>
                      <p className="text-sm font-medium text-gray-100">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-400">{session?.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-100 hover:bg-red-600 bg-gray-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
              {/* Read-only banner */}
              <ReadOnlyBanner />
              
              {/* Top bar */}
              <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-[#141414] border-b border-gray-800 lg:px-8">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-4 text-gray-300"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-semibold text-gray-100">
                  {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
                </h2>
              </header>

              {/* Page content */}
              <main className="p-4 lg:p-8">{children}</main>
            </div>
          </>
        )}
      </div>
    </ReadOnlyProvider>
    </DashboardWrapper>
  )
}
