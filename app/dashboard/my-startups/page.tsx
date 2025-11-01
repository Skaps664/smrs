"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, Calendar, TrendingUp, Users, Eye } from "lucide-react"

interface Startup {
  id: string
  name: string
  industry: string
  stage: string
  niche?: string
  joinedAt: string
  accessType: "MENTOR" | "INVESTOR"
  user: {
    name: string
    email: string
  }
}

export default function MyStartupsPage() {
  const router = useRouter()
  const [startups, setStartups] = useState<Startup[]>([])
  const [userRole, setUserRole] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      const response = await fetch("/api/my-startups")
      const data = await response.json()

      if (response.ok) {
        setStartups(data.startups || [])
        setUserRole(data.userRole)
      }
    } catch (error) {
      console.error("Error fetching startups:", error)
    } finally {
      setLoading(false)
    }
  }

  const viewStartup = (startupId: string) => {
    // Store the startup ID in session to enable read-only mode
    sessionStorage.setItem("viewingStartupId", startupId)
    router.push(`/dashboard?startupId=${startupId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-sm border-2 border-orange-200 p-8 mb-8">
          <h1 className="text-3xl font-bold flex items-center text-gray-900">
            <Building2 className="w-9 h-9 mr-3 text-orange-600" />
            My Startups
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {userRole === "MENTOR"
              ? "Startups you're mentoring"
              : "Startups in your investment portfolio"}
          </p>
        </div>

        {/* Startups Grid */}
        {startups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Startups Yet</h3>
            <p className="text-gray-600">
              {userRole === "MENTOR"
                ? "You haven't joined any startups as a mentor yet. Wait for invite links from startup founders."
                : "You haven't joined any startups as an investor yet. Wait for invite links from startup founders."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <div
                key={startup.id}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-orange-300 transition-all p-6 cursor-pointer group"
                onClick={() => viewStartup(startup.id)}
              >
                {/* Startup Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-xl font-bold">
                    {startup.name.charAt(0)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      startup.accessType === "MENTOR"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {startup.accessType === "MENTOR" ? "Mentoring" : "Investing"}
                  </span>
                </div>

                {/* Startup Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {startup.name}
                </h3>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    {startup.industry}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Stage: {startup.stage}
                  </div>
                  {startup.niche && (
                    <div className="text-gray-600">
                      Niche: {startup.niche}
                    </div>
                  )}
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="w-3 h-3 mr-2" />
                    Joined {new Date(startup.joinedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Founder Info */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Founder</p>
                  <p className="text-sm font-medium text-gray-900">{startup.user.name}</p>
                </div>

                {/* View Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    viewStartup(startup.id)
                  }}
                  className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Dashboard
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {startups.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Access Information</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  <strong>Read-Only Access:</strong> You can view all startup data but cannot edit or delete anything.
                </span>
              </li>
              {userRole === "MENTOR" && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    <strong>Provide Feedback:</strong> As a mentor, you can give feedback on different sections to guide the startup.
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  <strong>Confidentiality:</strong> All startup information should be kept confidential.
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
