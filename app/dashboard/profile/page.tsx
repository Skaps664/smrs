"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MentorsInvestorsSection from "@/components/MentorsInvestorsSection"
import MentorFeedbackButton from "@/components/MentorFeedbackButton"
import { useReadOnly } from "@/contexts/ReadOnlyContext"
import {
  Building2, Save, Sparkles, TrendingUp, Users, Globe,
  Award, Zap, Calendar, Mail, Phone, MapPin, Rocket,
  Target, Heart, CheckCircle, Shield, Play, ExternalLink,
  Clock, Briefcase, Film, Info, Plus, Trophy,
  Edit, Trash2, Linkedin, Twitter, Facebook, Instagram,
  Youtube, Github, Link as LinkIcon, BarChart3, Flag
} from "lucide-react"

const stages = [
  "IDEATION",
  "PROTOTYPE",
  "VALIDATION",
  "INCUBATION",
  "ACCELERATION",
  "GROWTH",
  "SCALE"
]

export default function StartupProfilePage() {
  const router = useRouter()
  const { isReadOnly, viewingStartupId } = useReadOnly()
  const [loading, setLoading] = useState(false)
  const [existing, setExisting] = useState<any>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [editingMember, setEditingMember] = useState<any>(null)
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '', phone: '' })
  const [formData, setFormData] = useState({
    name: "",
    founders: "",
    industry: "",
    niche: "",
    stage: "IDEATION",
    secpRegistered: false,
    secpNumber: "",
    fbrRegistered: false,
    ntnNumber: "",
    trademarkFiled: false,
    trademarkNumber: "",
    vision: "",
    mission: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    headquarters: "",
    operationLocations: [] as string[],
    socialMediaLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
      youtube: ""
    },
    otherLinks: {
      crunchbase: "",
      angellist: "",
      github: "",
      website2: ""
    },
    tipsAndTricks: [] as string[]
  })

  // Calculate startup metrics
  const calculateMetrics = () => {
    const foundersCount = formData.founders.split(',').filter(f => f.trim()).length
    const completionFields = [
      formData.name, formData.industry, formData.niche, formData.vision,
      formData.mission, formData.tagline, formData.email, formData.website
    ]
    const profileCompletion = Math.round((completionFields.filter(f => f).length / completionFields.length) * 100)

    const registrationScore = (
      (formData.secpRegistered ? 1 : 0) +
      (formData.fbrRegistered ? 1 : 0) +
      (formData.trademarkFiled ? 1 : 0)
    )

    const daysActive = existing?.createdAt
      ? Math.floor((Date.now() - new Date(existing.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    return {
      foundersCount,
      profileCompletion,
      registrationScore,
      daysActive,
      stageIndex: stages.indexOf(formData.stage)
    }
  }

  const metrics = calculateMetrics()

  useEffect(() => {
    fetchStartup()
  }, [viewingStartupId])

  const fetchStartup = async () => {
    try {
      // If viewing as mentor/investor, fetch the specific startup
      // Otherwise, fetch the current user's startup
      const url = viewingStartupId
        ? `/api/startup/${viewingStartupId}`
        : "/api/startup"
      const res = await fetch(url)
      const data = await res.json()

      // Handle both response formats: data.startups array from /api/startup or single object from /api/startup/[id]
      const startup = viewingStartupId ? data : (data.startups?.length > 0 ? data.startups[0] : null)

      if (startup) {
        setExisting(startup)
        setFormData({
          name: startup.name || "",
          founders: startup.founders?.join(", ") || "",
          industry: startup.industry || "",
          niche: startup.niche || "",
          stage: startup.stage || "IDEATION",
          secpRegistered: startup.secpRegistered || false,
          secpNumber: startup.secpNumber || "",
          fbrRegistered: startup.fbrRegistered || false,
          ntnNumber: startup.ntnNumber || "",
          trademarkFiled: startup.trademarkFiled || false,
          trademarkNumber: startup.trademarkNumber || "",
          vision: startup.vision || "",
          mission: startup.mission || "",
          tagline: startup.tagline || "",
          email: startup.email || "",
          phone: startup.phone || "",
          address: startup.address || "",
          website: startup.website || "",
          headquarters: startup.headquarters || "",
          operationLocations: startup.operationLocations || [],
          socialMediaLinks: startup.socialMediaLinks || {
            linkedin: "",
            twitter: "",
            facebook: "",
            instagram: "",
            youtube: ""
          },
          otherLinks: startup.otherLinks || {
            crunchbase: "",
            angellist: "",
            github: "",
            website2: ""
          },
          tipsAndTricks: startup.tipsAndTricks || []
        })
        // Fetch team members
        if (startup.id) {
          fetchTeamMembers(startup.id)
        }
      } else if (!viewingStartupId) {
        // No startup exists, prefill from User profile
        fetchUserProfileForPrefill()
      }
    } catch (error) {
      console.error("Error fetching startup:", error)
    }
  }

  const fetchUserProfileForPrefill = async () => {
    try {
      const res = await fetch("/api/settings/profile")
      if (res.ok) {
        const userProfile = await res.json()
        setFormData(prev => ({
          ...prev,
          founders: userProfile.name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          stage: userProfile.currentStage || "IDEATION",
        }))
      }
    } catch (error) {
      console.error("Error fetching user profile for prefill:", error)
    }
  }

  const fetchTeamMembers = async (startupId: string) => {
    try {
      const res = await fetch(`/api/team-member?startupId=${startupId}`)
      const data = await res.json()
      setTeamMembers(data)
    } catch (error) {
      console.error("Error fetching team members:", error)
    }
  }

  const addTeamMember = async () => {
    if (!newMember.name || !newMember.role || !existing?.id) return

    try {
      const res = await fetch('/api/team-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newMember, startupId: existing.id })
      })
      const data = await res.json()
      setTeamMembers([...teamMembers, data])
      setNewMember({ name: '', role: '', email: '', phone: '' })
    } catch (error) {
      console.error("Error adding team member:", error)
    }
  }

  const updateTeamMember = async (member: any) => {
    try {
      const res = await fetch('/api/team-member', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      })
      const data = await res.json()
      setTeamMembers(teamMembers.map(m => m.id === data.id ? data : m))
      setEditingMember(null)
    } catch (error) {
      console.error("Error updating team member:", error)
    }
  }

  const deleteTeamMember = async (id: string) => {
    try {
      await fetch(`/api/team-member?id=${id}`, { method: 'DELETE' })
      setTeamMembers(teamMembers.filter(m => m.id !== id))
    } catch (error) {
      console.error("Error deleting team member:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent submission if in read-only mode
    if (isReadOnly) {
      alert("You cannot edit this startup in read-only mode")
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        founders: formData.founders.split(",").map(f => f.trim()).filter(Boolean),
      }

      const method = existing ? "PUT" : "POST"
      const body = existing ? { id: existing.id, ...payload } : payload

      const res = await fetch("/api/startup", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        // Just reload the data to show updated state
        await fetchStartup()
      }
    } catch (error) {
      console.error("Error saving startup:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section - Professional Design */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-lg border-t-4 border-orange-400 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-orange-500/15 p-4 rounded-xl mr-4">
                <Rocket className="w-10 h-10 text-orange-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-200">
                  {formData.name || "Your Startup Profile"}
                </h1>
                <p className="text-gray-400 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                  {formData.tagline || "Building the future, one step at a time"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-orange-500/15 px-6 py-3 rounded-lg text-sm font-semibold text-orange-400 border border-orange-500/30 mb-3">
                {formData.stage.replace("_", " ")} Stage
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#111] border border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Users className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-200">{metrics.foundersCount}</p>
              <p className="text-sm text-gray-400">Founders</p>
            </div>
            <div className="bg-[#111] border border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Trophy className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-200">{metrics.profileCompletion}%</p>
              <p className="text-sm text-gray-400">Complete</p>
            </div>
            <div className="bg-[#111] border border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Shield className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-200">{metrics.registrationScore}/3</p>
              <p className="text-sm text-gray-400">Registrations</p>
            </div>
            <div className="bg-[#111] border border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Calendar className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-200">{metrics.daysActive}</p>
              <p className="text-sm text-gray-400">Days Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Insights Block */}
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-orange-600" />
            Profile Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Insights Left Panel */}
            <div className="grid grid-col-1 gap-4 md:col-span-1">
              <div className="flex items-center p-4 bg-[#111] rounded-lg border border-gray-700">
                <Briefcase className="w-6 h-6 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Industry</p>
                  <p className="font-semibold text-gray-200">{formData.industry || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-[#111] rounded-lg border border-gray-700">
                <Target className="w-6 h-6 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Niche</p>
                  <p className="font-semibold text-gray-200">{formData.niche || "Not set"}</p>
                </div>
              </div>
            </div>
            {/* Recommendations Right Panel */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 md:col-span-3">
              <h4 className="text-md font-bold mb-4 text-gray-200 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-600" />
                Quick Wins to Boost Your Profile
              </h4>
              <ul className="space-y-3">
                {metrics.profileCompletion < 100 && (
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span className="text-gray-300">Complete all profile fields to reach 100% completion</span>
                  </li>
                )}
                {metrics.registrationScore < 3 && (
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span className="text-gray-300">Consider completing SECP/FBR/Trademark legal registrations for advanced credibility</span>
                  </li>
                )}
                {!formData.website && (
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span className="text-gray-300">Add a website endpoint to better establish your online presence</span>
                  </li>
                )}
                {!formData.tagline && (
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span className="text-gray-300">Create a compelling tagline to summarize your offering instantly</span>
                  </li>
                )}
                {metrics.profileCompletion === 100 && metrics.registrationScore >= 2 && formData.website && formData.tagline && (
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-300">Your profile looks fantastic! Keep driving that vision forward.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-orange-500 rounded-2xl shadow-xl overflow-hidden border-2 border-orange-600">
        <div className="p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <Film className="w-6 h-6 mr-3" />
                Building a Startup Profile That Stands Out
              </h2>
              <p className="text-orange-100">Watch this fast guide to optimize your profile page for success</p>
            </div>
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="bg-[#1a1a1a] text-orange-600 hover:bg-orange-500/10 px-6 py-2 rounded-full font-semibold transition-all flex items-center shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {showVideo ? 'Hide Video' : 'Watch Now'}
            </button>
          </div>

          {showVideo && (
            <div className="mt-6 rounded-xl overflow-hidden shadow-2xl">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full border border-gray-700"
                  src="https://www.youtube.com/embed/9kJVuGGGv7c"
                  title="Startup Profile Guide"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Info className="w-6 h-6" />
            <h2 className="text-xl font-bold">Read-Only Mode</h2>
          </div>
          <p className="text-blue-400">
            You are viewing this startup's profile. You cannot make changes.
          </p>
        </div>
      )}

      {/* Unified Comprehensive Form */}
      <form onSubmit={handleSubmit} className={`bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-700 p-8 ${isReadOnly ? 'pointer-events-none opacity-80' : ''}`}>

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-200 mb-2 flex justify-center items-center gap-2">
            <Building2 className="w-8 h-8 text-orange-600" />
            Manage Your Brand Elements
          </h2>
          <p className="text-gray-400 text-lg">Detailed configuration of your entire profile footprint</p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Basic Information */}
          <div className="bg-orange-500/5 rounded-xl p-6 border border-orange-500/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-200">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm mr-3">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Startup Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111]" placeholder="Enter your awesome startup name" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Founders (comma-separated) *</label>
                <input type="text" required value={formData.founders} onChange={(e) => setFormData({ ...formData, founders: e.target.value })}
                  placeholder="e.g., John Doe, Jane Smith, Alex Johnson" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Industry *</label>
                <input type="text" required value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Technology, Healthcare, FinTech" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Niche *</label>
                <input type="text" required value={formData.niche} onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="e.g., AI-powered Mobile Apps" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Current Stage *</label>
                <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111] text-gray-300">
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Legal & Registrations */}
          <div className="bg-[#111]/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-200">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm mr-3">2</span>
              Legal Registrations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] rounded-lg p-5 border border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <input type="checkbox" checked={formData.secpRegistered} onChange={(e) => setFormData({ ...formData, secpRegistered: e.target.checked })}
                    className="w-5 h-5 text-orange-500 rounded bg-[#111] border-gray-600 focus:ring-orange-500" />
                  <label className="font-semibold text-gray-200">SECP Registered ✨</label>
                </div>
                {formData.secpRegistered && (
                  <input type="text" value={formData.secpNumber} onChange={(e) => setFormData({ ...formData, secpNumber: e.target.value })}
                    placeholder="SECP Number" className="w-full px-4 py-2 border border-orange-500/50 rounded-lg bg-[#111] focus:ring-2 focus:ring-orange-500" />
                )}
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-5 border border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <input type="checkbox" checked={formData.fbrRegistered} onChange={(e) => setFormData({ ...formData, fbrRegistered: e.target.checked })}
                    className="w-5 h-5 text-orange-500 rounded bg-[#111] border-gray-600 focus:ring-orange-500" />
                  <label className="font-semibold text-gray-200">FBR Registered 🏛️</label>
                </div>
                {formData.fbrRegistered && (
                  <input type="text" value={formData.ntnNumber} onChange={(e) => setFormData({ ...formData, ntnNumber: e.target.value })}
                    placeholder="NTN Number" className="w-full px-4 py-2 border border-orange-500/50 rounded-lg bg-[#111] focus:ring-2 focus:ring-orange-500" />
                )}
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-5 border border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <input type="checkbox" checked={formData.trademarkFiled} onChange={(e) => setFormData({ ...formData, trademarkFiled: e.target.checked })}
                    className="w-5 h-5 text-orange-500 rounded bg-[#111] border-gray-600 focus:ring-orange-500" />
                  <label className="font-semibold text-gray-200">Trademark Filed ®️</label>
                </div>
                {formData.trademarkFiled && (
                  <input type="text" value={formData.trademarkNumber} onChange={(e) => setFormData({ ...formData, trademarkNumber: e.target.value })}
                    placeholder="Trademark Number" className="w-full px-4 py-2 border border-orange-500/50 rounded-lg bg-[#111] focus:ring-2 focus:ring-orange-500" />
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Brand Story */}
          <div className="bg-orange-500/5 rounded-xl p-6 border border-orange-500/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-200">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm mr-3">3</span>
              Brand Story
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Vision 🔭</label>
                <textarea value={formData.vision} onChange={(e) => setFormData({ ...formData, vision: e.target.value })} rows={3}
                  placeholder="Where do you see your startup in 5-10 years? Paint the big picture..."
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Mission 🎯</label>
                <textarea value={formData.mission} onChange={(e) => setFormData({ ...formData, mission: e.target.value })} rows={3}
                  placeholder="What problem are you solving? Why does your startup exist?"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Tagline ✨</label>
                <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Your catchy one-liner that captures your essence"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#111]" />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111]/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm mr-3">4</span>
                Primary Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="startup@example.com" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Official Website</label>
                  <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourstartup.com" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a]" />
                </div>
              </div>
            </div>

            <div className="bg-[#111]/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm mr-3">5</span>
                Locations
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Primary Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Address of incorporation" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Headquarters</label>
                  <input type="text" value={formData.headquarters} onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    placeholder="Main operating HQ (e.g. Lahore, PK)" className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300 flex justify-between">
                    Other Operation Locations
                    <button type="button" onClick={() => { setFormData({ ...formData, operationLocations: [...formData.operationLocations, ''] }) }}
                      className="text-orange-500 hover:text-orange-400 font-bold text-xs"
                    >
                      + ADD LOCATION
                    </button>
                  </label>
                  {formData.operationLocations.map((location, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" value={location} onChange={(e) => {
                        const newLocations = [...formData.operationLocations]
                        newLocations[index] = e.target.value
                        setFormData({ ...formData, operationLocations: newLocations })
                      }} placeholder="Add city/region" className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-500 bg-[#1a1a1a]" />
                      <button type="button" onClick={() => {
                        const newLocations = formData.operationLocations.filter((_, i) => i !== index)
                        setFormData({ ...formData, operationLocations: newLocations })
                      }} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 rounded-lg transition-all border border-red-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.operationLocations.length === 0 && <p className="text-xs text-gray-500 italic">No secondary locations documented.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Web Presence */}
          <div className="bg-orange-500/5 rounded-xl p-6 border border-orange-500/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-200">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm mr-3">6</span>
              Web & Social Presence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold mb-2 text-gray-300 hover:text-blue-500 select-none cursor-pointer"><Linkedin className="w-4 h-4 mr-2" /> LinkedIn URL</label>
                <input type="url" value={formData.socialMediaLinks.linkedin} onChange={(e) => setFormData({ ...formData, socialMediaLinks: { ...formData.socialMediaLinks, linkedin: e.target.value } })}
                  placeholder="https://linkedin.com/..." className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 bg-[#111]" />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold mb-2 text-gray-300 hover:text-sky-500 select-none cursor-pointer"><Twitter className="w-4 h-4 mr-2" /> Twitter URL</label>
                <input type="url" value={formData.socialMediaLinks.twitter} onChange={(e) => setFormData({ ...formData, socialMediaLinks: { ...formData.socialMediaLinks, twitter: e.target.value } })}
                  placeholder="https://twitter.com/..." className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-1 focus:ring-sky-500 bg-[#111]" />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold mb-2 text-gray-300 hover:text-red-600 select-none cursor-pointer"><Youtube className="w-4 h-4 mr-2" /> YouTube URL</label>
                <input type="url" value={formData.socialMediaLinks.youtube} onChange={(e) => setFormData({ ...formData, socialMediaLinks: { ...formData.socialMediaLinks, youtube: e.target.value } })}
                  placeholder="https://youtube.com/..." className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-1 focus:ring-red-600 bg-[#111]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Crunchbase URL</label>
                <input type="url" value={formData.otherLinks.crunchbase} onChange={(e) => setFormData({ ...formData, otherLinks: { ...formData.otherLinks, crunchbase: e.target.value } })}
                  placeholder="https://crunchbase.com/..." className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-400 bg-[#111]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">AngelList URL</label>
                <input type="url" value={formData.otherLinks.angellist} onChange={(e) => setFormData({ ...formData, otherLinks: { ...formData.otherLinks, angellist: e.target.value } })}
                  placeholder="https://angel.co/..." className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-400 bg-[#111]" />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold mb-2 text-gray-300 hover:text-purple-500 select-none cursor-pointer"><Github className="w-4 h-4 mr-2" /> Github Repo</label>
                <input type="url" value={formData.otherLinks.github} onChange={(e) => setFormData({ ...formData, otherLinks: { ...formData.otherLinks, github: e.target.value } })}
                  placeholder="https://github.com/..." className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-1 focus:ring-purple-400 bg-[#111]" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={loading || isReadOnly}
              className="py-4 px-10 text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] disabled:opacity-50 transition-all flex items-center justify-center transform hover:-translate-y-1"
            >
              <Save className="w-6 h-6 mr-3" />
              {isReadOnly ? "Read-Only Mode" : loading ? "Saving Configuration..." : existing ? "Update Profile Data" : "Create Startup Profile"}
            </button>
          </div>
        </div>
      </form>

      {/* Auxiliary Tooling: Team Members & Access Lists */}
      {existing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-gray-700">

          <div className="bg-[#1a1a1a] rounded-xl p-8 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center text-gray-200">
                  <Users className="w-6 h-6 mr-3 text-orange-600" />
                  Team Roster
                </h3>
                <p className="text-gray-400 text-sm mt-1">Manage core team members attached to {formData.name}</p>
              </div>
            </div>

            {!isReadOnly && (
              <div className="bg-[#111] rounded-lg p-5 mb-6 border border-orange-500/20 shadow-inner">
                <p className="text-sm font-semibold text-orange-400 mb-3 flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Provide member logic
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <input type="text" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Member Name *" className="px-4 py-2 text-sm border border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-500 bg-[#1a1a1a]" />
                  <input type="text" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="Official Role *" className="px-4 py-2 text-sm border border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-500 bg-[#1a1a1a]" />
                  <input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Email Addr" className="px-4 py-2 text-sm border border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-500 bg-[#1a1a1a]" />
                  <input type="tel" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="Direct Phone" className="px-4 py-2 text-sm border border-gray-600 rounded-lg focus:ring-1 focus:ring-orange-500 bg-[#1a1a1a]" />
                </div>
                <button
                  type="button"
                  onClick={addTeamMember}
                  disabled={!newMember.name || !newMember.role}
                  className="w-full justify-center bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                >
                  Confirm New Team Integration
                </button>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-[#222] rounded-lg p-4 border border-gray-600 shadow-sm transition-hover hover:border-orange-500/50">
                  {editingMember?.id === member.id ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" value={editingMember.name} onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        className="px-4 py-2 text-sm border border-orange-500/50 rounded-lg bg-[#1a1a1a] text-white" />
                      <input type="text" value={editingMember.role} onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                        className="px-4 py-2 text-sm border border-orange-500/50 rounded-lg bg-[#1a1a1a] text-white" />
                      <input type="email" value={editingMember.email || ''} onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                        className="px-4 py-2 text-sm border border-orange-500/50 rounded-lg bg-[#1a1a1a] text-white" />
                      <input type="tel" value={editingMember.phone || ''} onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                        className="px-4 py-2 text-sm border border-orange-500/50 rounded-lg bg-[#1a1a1a] text-white" />
                      <div className="sm:col-span-2 flex gap-2 pt-2">
                        <button onClick={() => updateTeamMember(editingMember)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold">
                          Save Changes
                        </button>
                        <button onClick={() => setEditingMember(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-100 text-lg leading-tight mb-1">{member.name}</h4>
                        <p className="text-sm font-semibold text-orange-400 mb-2">{member.role}</p>
                        {member.email && <p className="text-xs text-gray-400 flex items-center gap-2 mb-1"><Mail className="w-3 h-3 text-gray-500" />{member.email}</p>}
                        {member.phone && <p className="text-xs text-gray-400 flex items-center gap-2"><Phone className="w-3 h-3 text-gray-500" />{member.phone}</p>}
                      </div>
                      {!isReadOnly && (
                        <div className="flex gap-2 min-w-max ml-4">
                          <button onClick={() => setEditingMember(member)} className="bg-gray-700 hover:bg-orange-500 text-white p-2 rounded-full transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteTeamMember(member.id)} className="bg-gray-700 hover:bg-red-500 text-white p-2 rounded-full transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-[#111] rounded-lg border border-dashed border-gray-700">
                  <Users className="w-12 h-12 mb-3 text-gray-600 opacity-50" />
                  <p className="font-medium">No team members deployed yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <MentorsInvestorsSection startupId={existing.id} />
          </div>

        </div>
      )}

      {/* Startup Journey Timeline */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-8 border border-gray-700 mt-12 mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-200">
          <Flag className="w-6 h-6 mr-3 text-orange-600" />
          The Roadmap Journey
        </h2>
        <div className="relative pb-6">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/10 via-orange-500/20 to-transparent"></div>
          {stages.map((stage, idx) => {
            const isCompleted = idx < metrics.stageIndex
            const isCurrent = idx === metrics.stageIndex
            return (
              <div key={stage} className="relative flex items-center mb-8 last:mb-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 transition-all ${isCurrent ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-110 border-4 border-orange-500/30' :
                  isCompleted ? 'bg-green-600 border-4 border-green-500/30 shadow-lg' :
                    'bg-[#1a1a1a] border-2 border-gray-700'
                  }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : isCurrent ? (
                    <Zap className="w-8 h-8 text-white animate-pulse" />
                  ) : (
                    <span className="text-gray-600 font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className={`ml-8 flex-1 p-5 rounded-xl border transition-all ${isCurrent ? 'bg-orange-500/10 border-orange-500/50 shadow-md' :
                  isCompleted ? 'bg-green-500/5 border-green-500/30' :
                    'bg-[#111] border-gray-800 opacity-60'
                  }`}>
                  <h3 className={`font-bold text-lg mb-1 ${isCurrent ? 'text-orange-400' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                    {stage.replace("_", " ")} PHASE
                  </h3>
                  <p className={`text-sm ${isCurrent ? 'text-orange-200' : 'text-gray-400'}`}>
                    {isCurrent && "🎯 Active Phase. You are pushing barriers!"}
                    {isCompleted && "✅ Milestones successfully achieved."}
                    {!isCurrent && !isCompleted && "⏳ Locked payload."}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <MentorFeedbackButton
        section="Startup Profile"
        sectionData={{
          startupName: formData.name,
          stage: formData.stage,
          industry: formData.industry,
          profileCompletion: metrics.profileCompletion,
        }}
      />
    </div>
  )
}
