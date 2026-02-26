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
import ReadOnlyBanner from "@/components/ReadOnlyBanner"
import { useFeedbackUnreadCount } from "@/hooks/useFeedbackUnreadCount"

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

export function DashboardLayoutClient({
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

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => document.body.style.removeProperty("overflow");
  }, [sidebarOpen]);

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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {isViewingStartup ? (
        <ReadOnlyBanner startupId={startupId!} />
      ) : null}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-[#141414] border-r border-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-8">
              <h1 className="font-[var(--font-bebas)] text-3xl tracking-tight text-orange-500">
                EAZSTART
              </h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {(isViewingStartup ? navigation : (userRole === "MENTOR" || userRole === "INVESTOR" ? mentorNavigation : navigation)).map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={isViewingStartup ? `${item.href}?startupId=${startupId}` : item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive
                        ? "bg-orange-500/20 text-orange-500"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                      }
                    `}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-400"
                        }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.name === "Mentor Feedback" && unreadCount > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-800 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="ml-3 flex-shrink-0 p-2 rounded-md text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-[#141414] border-r border-gray-800 transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex items-center justify-between px-4 mb-8">
              <h1 className="font-[var(--font-bebas)] text-3xl tracking-tight text-orange-500">
                EAZSTART
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-100 hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {(isViewingStartup ? navigation : (userRole === "MENTOR" || userRole === "INVESTOR" ? mentorNavigation : navigation)).map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={isViewingStartup ? `${item.href}?startupId=${startupId}` : item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive
                        ? "bg-orange-500/20 text-orange-500"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                      }
                    `}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-400"
                        }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.name === "Mentor Feedback" && unreadCount > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-800 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="ml-3 flex-shrink-0 p-2 rounded-md text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-[#141414] border-b border-gray-800 lg:hidden">
        <button
          type="button"
          className="px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex flex-1 justify-between items-center px-4">
          <h1 className="font-[var(--font-bebas)] text-2xl tracking-tight text-orange-500">
            EAZSTART
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
