"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, Link as LinkIcon, Copy, Check, Trash2, Mail, Calendar, Building2, MapPin } from "lucide-react"

interface Mentor {
  id: string
  mentorId: string
  joinedAt: string
  mentor: {
    name: string
    email: string
    mentorCompany?: string
    mentorLocation?: string
    mentorLinkedin?: string
  }
}

interface Investor {
  id: string
  investorId: string
  joinedAt: string
  investor: {
    name: string
    email: string
    investorPortfolio?: string
    investorLocation?: string
  }
}

interface InviteLink {
  id: string
  inviteType: "MENTOR" | "INVESTOR"
  token: string
  email?: string
  expiresAt: string
  usedAt?: string
  usedBy?: string
  isActive: boolean
  createdAt: string
}

export default function MentorsInvestorsPage() {
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [investors, setInvestors] = useState<Investor[]>([])
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [mentorRes, investorsRes, invitesRes] = await Promise.all([
        fetch("/api/mentors-investors/mentor"),
        fetch("/api/mentors-investors/investors"),
        fetch("/api/mentors-investors/invites"),
      ])

      const mentorData = await mentorRes.json()
      const investorsData = await investorsRes.json()
      const invitesData = await invitesRes.json()

      if (mentorData.mentor) setMentor(mentorData.mentor)
      setInvestors(investorsData.investors || [])
      setInviteLinks(invitesData.invites || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateInviteLink = async (type: "MENTOR" | "INVESTOR", email?: string) => {
    setGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/mentors-investors/generate-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteType: type, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to generate invite")
        return
      }

      fetchData() // Refresh the list
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setGenerating(false)
    }
  }

  const revokeInvite = async (inviteId: string) => {
    if (!confirm("Are you sure you want to revoke this invite?")) return

    try {
      await fetch(`/api/mentors-investors/invites/${inviteId}`, {
        method: "DELETE",
      })
      fetchData()
    } catch (error) {
      console.error("Error revoking invite:", error)
    }
  }

  const removeMentor = async () => {
    if (!confirm("Are you sure you want to remove your mentor? They will lose access to your startup data.")) return

    try {
      await fetch("/api/mentors-investors/mentor", {
        method: "DELETE",
      })
      setMentor(null)
    } catch (error) {
      console.error("Error removing mentor:", error)
    }
  }

  const removeInvestor = async (investorId: string) => {
    if (!confirm("Are you sure you want to remove this investor?")) return

    try {
      await fetch(`/api/mentors-investors/investors/${investorId}`, {
        method: "DELETE",
      })
      fetchData()
    } catch (error) {
      console.error("Error removing investor:", error)
    }
  }

  const copyToClipboard = (token: string) => {
    const inviteUrl = `${window.location.origin}/invite/${token}`
    navigator.clipboard.writeText(inviteUrl)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  const hasMentor = mentor !== null
  const activeMentorInvites = inviteLinks.filter(
    (inv) => inv.inviteType === "MENTOR" && inv.isActive && !inv.usedAt
  )
  const activeInvestorInvites = inviteLinks.filter(
    (inv) => inv.inviteType === "INVESTOR" && inv.isActive && !inv.usedAt
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl shadow-sm border-2 border-orange-500/30 p-8">
        <h1 className="text-3xl font-bold flex items-center text-gray-100">
          <Users className="w-9 h-9 mr-3 text-orange-600" />
          Mentors & Investors
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Invite mentors and investors to collaborate on your startup journey
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Mentor Section */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 flex items-center">
              <UserPlus className="w-6 h-6 mr-2 text-orange-600" />
              Mentor
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Only one mentor can be assigned to provide guidance and feedback
            </p>
          </div>
          {!hasMentor && activeMentorInvites.length === 0 && (
            <button
              onClick={() => generateInviteLink("MENTOR")}
              disabled={generating}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50"
            >
              <LinkIcon className="w-4 h-4" />
              Generate Mentor Invite
            </button>
          )}
        </div>

        {/* Current Mentor */}
        {hasMentor && mentor && (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-50 border-2 border-green-500/30 rounded-lg p-6 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                    {mentor.mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">{mentor.mentor.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {mentor.mentor.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {mentor.mentor.mentorCompany && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {mentor.mentor.mentorCompany}
                    </div>
                  )}
                  {mentor.mentor.mentorLocation && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {mentor.mentor.mentorLocation}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined {new Date(mentor.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button
                onClick={removeMentor}
                className="text-red-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10"
                title="Remove mentor"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Pending Mentor Invites */}
        {!hasMentor && activeMentorInvites.length > 0 && (
          <div className="space-y-3">
            {activeMentorInvites.map((invite) => (
              <div
                key={invite.id}
                className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-100">Pending Mentor Invite</p>
                  <p className="text-sm text-gray-400">
                    Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(invite.token)}
                    className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
                  >
                    {copiedToken === invite.token ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => revokeInvite(invite.id)}
                    className="text-red-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!hasMentor && activeMentorInvites.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No mentor assigned yet. Generate an invite link to add a mentor.</p>
          </div>
        )}
      </div>

      {/* Investors Section */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 flex items-center">
              <Users className="w-6 h-6 mr-2 text-orange-600" />
              Investors
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Multiple investors can be added to monitor your startup progress
            </p>
          </div>
          <button
            onClick={() => generateInviteLink("INVESTOR")}
            disabled={generating}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50"
          >
            <LinkIcon className="w-4 h-4" />
            Generate Investor Invite
          </button>
        </div>

        {/* Current Investors */}
        {investors.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-100">Active Investors ({investors.length})</h3>
            {investors.map((investor) => (
              <div
                key={investor.id}
                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-lg p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                      {investor.investor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-100">{investor.investor.name}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {investor.investor.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm ml-13">
                    {investor.investor.investorPortfolio && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {investor.investor.investorPortfolio}
                      </div>
                    )}
                    {investor.investor.investorLocation && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {investor.investor.investorLocation}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Joined {new Date(investor.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeInvestor(investor.id)}
                  className="text-red-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10"
                  title="Remove investor"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pending Investor Invites */}
        {activeInvestorInvites.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-100">
              Pending Invites ({activeInvestorInvites.length})
            </h3>
            {activeInvestorInvites.map((invite) => (
              <div
                key={invite.id}
                className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-100">Pending Investor Invite</p>
                  <p className="text-sm text-gray-400">
                    Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(invite.token)}
                    className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
                  >
                    {copiedToken === invite.token ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => revokeInvite(invite.id)}
                    className="text-red-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {investors.length === 0 && activeInvestorInvites.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No investors added yet. Generate an invite link to add investors.</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="font-semibold text-blue-200 mb-2">How it works</h3>
        <ul className="space-y-2 text-sm text-blue-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Mentor:</strong> Only one mentor can be assigned. They have read-only access to all pages and can provide feedback on each section.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Investors:</strong> Multiple investors can be added. They have read-only access to all pages but cannot give feedback.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Invite Links:</strong> Share the generated link with your mentor or investors. Links expire after 7 days.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Access Control:</strong> Mentors and investors can only view data, not edit or delete anything.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
