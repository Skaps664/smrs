"use client"

import { useState, useEffect } from "react"
import { Users, Briefcase, MapPin, Linkedin, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Mentor {
  id: string
  mentorId: string
  joinedAt: string
  mentor: {
    name: string
    email: string
    mentorCompany: string | null
    mentorLinkedin: string | null
    mentorLocation: string | null
  }
}

interface Investor {
  id: string
  investorId: string
  joinedAt: string
  investor: {
    name: string
    email: string
    investorPortfolio: string | null
    investorLocation: string | null
  }
}

export default function MentorsInvestorsSection({ startupId }: { startupId: string }) {
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMentorAndInvestors()
  }, [])

  const fetchMentorAndInvestors = async () => {
    try {
      const [mentorRes, investorsRes] = await Promise.all([
        fetch("/api/mentors-investors/mentor"),
        fetch("/api/mentors-investors/investors"),
      ])

      if (mentorRes.ok) {
        const mentorData = await mentorRes.json()
        setMentor(mentorData.mentor)
      }

      if (investorsRes.ok) {
        const investorsData = await investorsRes.json()
        setInvestors(investorsData.investors || [])
      }
    } catch (error) {
      console.error("Error fetching mentors/investors:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-[#1f1f1f] rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-[#141414] rounded"></div>
            <div className="h-20 bg-[#141414] rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!mentor && investors.length === 0) {
    return (
      <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-lg shadow-sm border-2 border-orange-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            Mentors & Investors
          </h3>
          <Link
            href="/dashboard/mentors-investors"
            className="text-sm text-orange-600 hover:text-orange-400 font-medium"
          >
            Manage Access →
          </Link>
        </div>
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-orange-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">No mentors or investors yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Generate invite links to add a mentor or investors to your startup
          </p>
          <Link
            href="/dashboard/mentors-investors"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            Generate Invite Links
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2 text-orange-600" />
          Mentors & Investors
        </h3>
        <Link
          href="/dashboard/mentors-investors"
          className="text-sm text-orange-600 hover:text-orange-400 font-medium flex items-center"
        >
          Manage
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {/* Mentor Card */}
        {mentor && (
          <div className="bg-orange rounded-lg p-5 border-2 border-green-500/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                  {mentor.mentor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-100">{mentor.mentor.name}</h4>
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium">
                      Mentor
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{mentor.mentor.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pl-15">
              {mentor.mentor.mentorCompany && (
                <div className="flex items-center text-sm text-gray-300">
                  <Briefcase className="w-4 h-4 mr-2 text-green-600" />
                  <span>{mentor.mentor.mentorCompany}</span>
                </div>
              )}
              {mentor.mentor.mentorLocation && (
                <div className="flex items-center text-sm text-gray-300">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  <span>{mentor.mentor.mentorLocation}</span>
                </div>
              )}
              {mentor.mentor.mentorLinkedin && (
                <div className="flex items-center text-sm">
                  <Linkedin className="w-4 h-4 mr-2 text-green-600" />
                  <a
                    href={mentor.mentor.mentorLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-400 hover:underline"
                  >
                    View LinkedIn Profile
                  </a>
                </div>
              )}
              <div className="flex items-center text-xs text-gray-400 pt-2 border-t border-green-500/30">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Joined {new Date(mentor.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Investors Section */}
        {investors.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-100 mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
              Investors ({investors.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {investors.slice(0, 4).map((investor) => (
                <div
                  key={investor.id}
                  className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg p-4 border border-blue-500/30"
                >
                  <div className="flex items-start mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                      {investor.investor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-gray-100 text-sm truncate">
                          {investor.investor.name}
                        </h5>
                        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium flex-shrink-0">
                          Investor
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{investor.investor.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {investor.investor.investorPortfolio && (
                      <div className="flex items-start text-gray-300">
                        <Briefcase className="w-3 h-3 mr-1.5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{investor.investor.investorPortfolio}</span>
                      </div>
                    )}
                    {investor.investor.investorLocation && (
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-3 h-3 mr-1.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{investor.investor.investorLocation}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-400 pt-1 border-t border-blue-500/30">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Joined {new Date(investor.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {investors.length > 4 && (
              <Link
                href="/dashboard/mentors-investors"
                className="block text-center mt-3 text-sm text-blue-600 hover:text-blue-400 font-medium"
              >
                View all {investors.length} investors →
              </Link>
            )}
          </div>
        )}

        {/* No mentor message */}
        {!mentor && investors.length > 0 && (
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
            <p className="text-sm text-yellow-300 mb-2 font-medium">No mentor assigned yet</p>
            <p className="text-xs text-yellow-400 mb-3">
              Add a mentor to get expert guidance and feedback on your startup journey
            </p>
            <Link
              href="/dashboard/mentors-investors"
              className="inline-flex items-center text-xs px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors font-medium"
            >
              Generate Mentor Invite
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
