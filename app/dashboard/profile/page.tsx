"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MentorsInvestorsSection from "@/components/MentorsInvestorsSection"
import MentorFeedbackButton from "@/components/MentorFeedbackButton"
import { useReadOnly } from "@/contexts/ReadOnlyContext"
import { 
  Building2, Save, Sparkles, TrendingUp, Users, Globe, 
  Award, Zap, Calendar, Mail, Phone, MapPin, Rocket,
  Target, Heart, Lightbulb, Star, Trophy, Flag,
  BarChart3, CheckCircle, Shield, Play, ExternalLink,
  Clock, DollarSign, Briefcase, Film, Info, X, Plus,
  Edit, Trash2, Linkedin, Twitter, Facebook, Instagram,
  Youtube, Github, Link as LinkIcon
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

// Fun facts based on startup stage
const stageFunFacts = {
  IDEATION: [
    "💡 You're in the idea phase! 42% of startups fail because there's no market need. Test your idea!",
    "🎯 Most successful founders spent 6+ months refining their initial idea",
    "🚀 Every unicorn company started exactly where you are now!"
  ],
  PROTOTYPE: [
    "🛠️ Prototypes help reduce development costs by up to 30%",
    "⚡ Fast prototyping: Dropbox's first prototype was just a video!",
    "🎨 Design thinking at this stage can 10x your product-market fit"
  ],
  VALIDATION: [
    "✅ 60% of features in products are never or rarely used - validate before building!",
    "📊 Customer validation reduces failure risk by 50%",
    "🎯 The best validation is when someone pays for your product"
  ],
  INCUBATION: [
    "🌱 Incubation typically lasts 3-6 months",
    "🤝 Startups in incubators are 87% more likely to succeed",
    "📈 Average funding increase: 84% after incubation programs"
  ],
  ACCELERATION: [
    "🚀 Accelerators help startups grow 3x faster than bootstrapping",
    "💰 Y Combinator alumni are worth $600B+ combined",
    "⚡ 3-4 months of acceleration = 1-2 years of organic growth"
  ],
  GROWTH: [
    "📊 You're scaling! 90% of startups that reach this stage achieve profitability",
    "🎯 Growth stage is all about optimization - test everything!",
    "💎 Average valuation growth: 300% during growth phase"
  ],
  SCALE: [
    "🏆 Only 1% of startups reach scale stage - you're exceptional!",
    "🌍 Scaling globally? 70% of unicorns expanded internationally at this stage",
    "💫 Time to think about market leadership and industry impact"
  ]
}

export default function StartupProfilePage() {
  const router = useRouter()
  const { isReadOnly, viewingStartupId } = useReadOnly()
  const [loading, setLoading] = useState(false)
  const [existing, setExisting] = useState<any>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'stats'>('edit')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
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
      
      // Handle both response formats: array from /api/startup or single object from /api/startup/[id]
      const startup = viewingStartupId ? data : (data.length > 0 ? data[0] : null)
      
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
      }
    } catch (error) {
      console.error("Error fetching startup:", error)
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
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Error saving startup:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Section - Professional Design */}
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-400 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-4 rounded-xl mr-4">
                <Rocket className="w-10 h-10 text-orange-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-800">
                  {formData.name || "Your Startup Profile"}
                </h1>
                <p className="text-gray-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                  {formData.tagline || "Building the future, one step at a time"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-orange-100 px-6 py-3 rounded-lg text-sm font-semibold text-orange-700 border border-orange-200 mb-3">
                {formData.stage.replace("_", " ")} Stage
              </div>
              <button
                onClick={() => setShowDetailsModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ml-auto shadow-md"
              >
                <Info className="w-5 h-5" />
                View Details
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Users className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-800">{metrics.foundersCount}</p>
              <p className="text-sm text-gray-600">Founders</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Trophy className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-800">{metrics.profileCompletion}%</p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Shield className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-800">{metrics.registrationScore}/3</p>
              <p className="text-sm text-gray-600">Registrations</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Calendar className="w-6 h-6 mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-800">{metrics.daysActive}</p>
              <p className="text-sm text-gray-600">Days Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Facts & Tips */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
        <div className="flex items-start">
          <Lightbulb className="w-8 h-8 text-orange-600 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              💡 Did You Know? <Star className="w-4 h-4 ml-2 text-orange-500" />
            </h3>
            <div className="space-y-2">
              {stageFunFacts[formData.stage as keyof typeof stageFunFacts]?.map((fact, idx) => (
                <p key={idx} className="text-gray-700 text-sm leading-relaxed">
                  {fact}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentors & Investors Section */}
      <MentorsInvestorsSection startupId={existing?.id || ''} />

      {/* Startup Journey Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
          <Flag className="w-6 h-6 mr-2 text-orange-600" />
          Your Startup Journey
        </h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-orange-200"></div>
          {stages.map((stage, idx) => {
            const isCompleted = idx < metrics.stageIndex
            const isCurrent = idx === metrics.stageIndex
            return (
              <div key={stage} className="relative flex items-center mb-8 last:mb-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 transition-all ${
                  isCurrent ? 'bg-orange-500 shadow-lg scale-110 border-4 border-orange-200' :
                  isCompleted ? 'bg-green-500 border-4 border-green-200' :
                  'bg-gray-200 border-4 border-gray-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : isCurrent ? (
                    <Zap className="w-8 h-8 text-white animate-pulse" />
                  ) : (
                    <Clock className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className={`ml-6 flex-1 p-4 rounded-lg border-2 transition-all ${
                  isCurrent ? 'bg-orange-50 border-orange-300' :
                  isCompleted ? 'bg-green-50 border-green-300' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`font-bold ${isCurrent ? 'text-orange-700' : isCompleted ? 'text-green-700' : 'text-gray-500'}`}>
                    {stage.replace("_", " ")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isCurrent && "🎯 You are here! Keep pushing forward!"}
                    {isCompleted && "✅ Completed - Great job!"}
                    {!isCurrent && !isCompleted && "⏳ Coming soon..."}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'edit'
                ? 'bg-orange-500 text-white border-b-4 border-orange-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-5 h-5 inline-block mr-2" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'bg-orange-500 text-white border-b-4 border-orange-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline-block mr-2" />
            Stats & Insights
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'edit' ? (
            <form onSubmit={handleSubmit} className={`space-y-8 ${isReadOnly ? 'pointer-events-none opacity-75' : ''}`}>
              {isReadOnly && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Info className="w-5 h-5" />
                    <p className="font-semibold">Read-Only Mode</p>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    You are viewing this startup's profile. You cannot make changes.
                  </p>
                </div>
              )}
              {/* Basic Information */}
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <Building2 className="w-6 h-6 mr-2 text-orange-600" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Startup Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                      placeholder="Enter your awesome startup name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Founders (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.founders}
                      onChange={(e) => setFormData({ ...formData, founders: e.target.value })}
                      placeholder="e.g., John Doe, Jane Smith, Alex Johnson"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Industry *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g., Technology, Healthcare, FinTech"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Niche *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.niche}
                      onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                      placeholder="e.g., AI-powered Mobile Apps"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Current Stage *
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    >
                      {stages.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <Shield className="w-6 h-6 mr-2 text-orange-600" />
                  Legal Registrations
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.secpRegistered}
                      onChange={(e) => setFormData({ ...formData, secpRegistered: e.target.checked })}
                      className="mt-1.5 w-5 h-5 text-orange-500 focus:ring-orange-400"
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700">
                        SECP Registered 🏢
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Securities and Exchange Commission of Pakistan</p>
                      {formData.secpRegistered && (
                        <input
                          type="text"
                          value={formData.secpNumber}
                          onChange={(e) => setFormData({ ...formData, secpNumber: e.target.value })}
                          placeholder="SECP Registration Number"
                          className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg mt-2 focus:ring-2 focus:ring-orange-400 bg-white"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.fbrRegistered}
                      onChange={(e) => setFormData({ ...formData, fbrRegistered: e.target.checked })}
                      className="mt-1.5 w-5 h-5 text-orange-500 focus:ring-orange-400"
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700">
                        FBR Registered 💰
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Federal Board of Revenue</p>
                      {formData.fbrRegistered && (
                        <input
                          type="text"
                          value={formData.ntnNumber}
                          onChange={(e) => setFormData({ ...formData, ntnNumber: e.target.value })}
                          placeholder="NTN Number"
                          className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg mt-2 focus:ring-2 focus:ring-orange-400 bg-white"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.trademarkFiled}
                      onChange={(e) => setFormData({ ...formData, trademarkFiled: e.target.checked })}
                      className="mt-1.5 w-5 h-5 text-orange-500 focus:ring-orange-400"
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700">
                        Trademark Filed ®️
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Protect your brand identity</p>
                      {formData.trademarkFiled && (
                        <input
                          type="text"
                          value={formData.trademarkNumber}
                          onChange={(e) => setFormData({ ...formData, trademarkNumber: e.target.value })}
                          placeholder="Trademark Number"
                          className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg mt-2 focus:ring-2 focus:ring-orange-400 bg-white"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Details */}
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <Heart className="w-6 h-6 mr-2 text-orange-600" />
                  Brand Story
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Vision 🔭
                    </label>
                    <textarea
                      value={formData.vision}
                      onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                      rows={3}
                      placeholder="Where do you see your startup in 5-10 years? Paint the big picture..."
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Mission 🎯
                    </label>
                    <textarea
                      value={formData.mission}
                      onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                      rows={3}
                      placeholder="What problem are you solving? Why does your startup exist?"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Tagline ✨
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Your catchy one-liner that captures your essence"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <Globe className="w-6 h-6 mr-2 text-orange-600" />
                  Contact & Presence
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-orange-600" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="startup@example.com"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-orange-600" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Your office or co-working space address"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-orange-600" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourawesome startup.com"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isReadOnly}
                className="w-full bg-orange-500 text-white py-4 px-8 rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg border-2 border-orange-600"
                title={isReadOnly ? "Read-only mode: Cannot edit this startup" : ""}
              >
                <Save className="w-6 h-6 mr-3" />
                {isReadOnly ? "🔒 Read-Only Mode" : loading ? "Saving..." : existing ? "🚀 Update Profile" : "🎉 Create Profile"}
              </button>
            </form>
          ) : (
            // Stats & Insights Tab
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-md">
                  <TrendingUp className="w-10 h-10 mb-4 text-orange-600" />
                  <h3 className="text-3xl font-bold mb-2 text-gray-800">{metrics.profileCompletion}%</h3>
                  <p className="text-gray-600 font-medium">Profile Completion</p>
                  <div className="mt-4 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${metrics.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-md">
                  <Users className="w-10 h-10 mb-4 text-orange-600" />
                  <h3 className="text-3xl font-bold mb-2 text-gray-800">{metrics.foundersCount}</h3>
                  <p className="text-gray-600 font-medium">Team Members</p>
                  <p className="text-sm text-gray-500 mt-2">Founders driving the vision</p>
                </div>

                <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-md">
                  <Award className="w-10 h-10 mb-4 text-orange-600" />
                  <h3 className="text-3xl font-bold mb-2 text-gray-800">{metrics.registrationScore}/3</h3>
                  <p className="text-gray-600 font-medium">Legal Compliance</p>
                  <p className="text-sm text-gray-500 mt-2">Registrations completed</p>
                </div>
              </div>

              {/* Additional insights */}
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800">📊 Profile Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                    <Briefcase className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="font-semibold text-gray-800">{formData.industry || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                    <Target className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Niche</p>
                      <p className="font-semibold text-gray-800">{formData.niche || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                    <Globe className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <p className="font-semibold truncate">
                        {formData.website ? (
                          <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 hover:underline flex items-center">
                            Visit <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : <span className="text-gray-800">Not set</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                    <Calendar className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Journey Started</p>
                      <p className="font-semibold text-gray-800">{metrics.daysActive} days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-orange-600" />
                  Quick Wins to Boost Your Profile
                </h3>
                <ul className="space-y-3">
                  {metrics.profileCompletion < 100 && (
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700">Complete all profile fields to reach 100%</span>
                    </li>
                  )}
                  {metrics.registrationScore < 3 && (
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700">Consider completing legal registrations for credibility</span>
                    </li>
                  )}
                  {!formData.website && (
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700">Add a website to establish online presence</span>
                    </li>
                  )}
                  {!formData.tagline && (
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700">Create a compelling tagline to capture your essence</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-orange-500 rounded-2xl shadow-2xl overflow-hidden border-4 border-orange-600">
        <div className="p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Film className="w-7 h-7 mr-3" />
                Building a Startup Profile That Stands Out
              </h2>
              <p className="text-orange-100">Watch this 3-minute guide to optimize your profile for success</p>
            </div>
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full font-semibold transition-all flex items-center shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {showVideo ? 'Hide Video' : 'Watch Now'}
            </button>
          </div>

          {showVideo && (
            <div className="mt-6 rounded-xl overflow-hidden shadow-2xl">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/9kJVuGGGv7c"
                  title="Startup Profile Guide"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {!showVideo && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <CheckCircle className="w-8 h-8 mb-2" />
                <h4 className="font-semibold mb-1">Complete Profile</h4>
                <p className="text-sm text-red-100">Fill all sections for maximum visibility</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <Target className="w-8 h-8 mb-2" />
                <h4 className="font-semibold mb-1">Clear Vision</h4>
                <p className="text-sm text-red-100">Articulate your mission & vision clearly</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <Trophy className="w-8 h-8 mb-2" />
                <h4 className="font-semibold mb-1">Legal Compliance</h4>
                <p className="text-sm text-red-100">Complete registrations for credibility</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-orange-500 text-white p-6 flex items-center justify-between border-b-4 border-orange-600">
              <div className="flex items-center gap-3">
                <Info className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Startup Details</h2>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Location Information */}
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <MapPin className="w-6 h-6 mr-2 text-orange-600" />
                  Location Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Headquarters
                    </label>
                    <input
                      type="text"
                      value={formData.headquarters}
                      onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                      placeholder="Main office location (e.g., Lahore, Pakistan)"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Operation Locations
                    </label>
                    {formData.operationLocations.map((location, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => {
                            const newLocations = [...formData.operationLocations]
                            newLocations[index] = e.target.value
                            setFormData({ ...formData, operationLocations: newLocations })
                          }}
                          placeholder="Operation location"
                          className="flex-1 px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                        />
                        <button
                          onClick={() => {
                            const newLocations = formData.operationLocations.filter((_, i) => i !== index)
                            setFormData({ ...formData, operationLocations: newLocations })
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setFormData({ ...formData, operationLocations: [...formData.operationLocations, ''] })
                      }}
                      className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Location
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <Users className="w-6 h-6 mr-2 text-orange-600" />
                  Team Members
                </h3>
                
                {/* Add New Member */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Add New Member</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Name *"
                      className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    <input
                      type="text"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      placeholder="Role *"
                      className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="Email"
                      className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                      placeholder="Phone"
                      className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <button
                    onClick={addTeamMember}
                    disabled={!newMember.name || !newMember.role}
                    className="mt-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>

                {/* Team Members List */}
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {editingMember?.id === member.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editingMember.name}
                            onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                            className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                          />
                          <input
                            type="text"
                            value={editingMember.role}
                            onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                            className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                          />
                          <input
                            type="email"
                            value={editingMember.email || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                            className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                          />
                          <input
                            type="tel"
                            value={editingMember.phone || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                            className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                          />
                          <div className="md:col-span-2 flex gap-2">
                            <button
                              onClick={() => updateTeamMember(editingMember)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMember(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{member.name}</h4>
                            <p className="text-sm text-orange-600 font-medium">{member.role}</p>
                            {member.email && (
                              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </p>
                            )}
                            {member.phone && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {member.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingMember(member)}
                              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTeamMember(member.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No team members added yet</p>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <Globe className="w-6 h-6 mr-2 text-orange-600" />
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.socialMediaLinks.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMediaLinks: { ...formData.socialMediaLinks, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/company/..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Twitter className="w-4 h-4 mr-2 text-sky-500" />
                      Twitter / X
                    </label>
                    <input
                      type="url"
                      value={formData.socialMediaLinks.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMediaLinks: { ...formData.socialMediaLinks, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={formData.socialMediaLinks.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMediaLinks: { ...formData.socialMediaLinks, facebook: e.target.value }
                      })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.socialMediaLinks.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMediaLinks: { ...formData.socialMediaLinks, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Youtube className="w-4 h-4 mr-2 text-red-600" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={formData.socialMediaLinks.youtube}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMediaLinks: { ...formData.socialMediaLinks, youtube: e.target.value }
                      })}
                      placeholder="https://youtube.com/@..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Other Links */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <LinkIcon className="w-6 h-6 mr-2 text-orange-600" />
                  Other Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Crunchbase
                    </label>
                    <input
                      type="url"
                      value={formData.otherLinks.crunchbase}
                      onChange={(e) => setFormData({
                        ...formData,
                        otherLinks: { ...formData.otherLinks, crunchbase: e.target.value }
                      })}
                      placeholder="https://crunchbase.com/organization/..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      AngelList
                    </label>
                    <input
                      type="url"
                      value={formData.otherLinks.angellist}
                      onChange={(e) => setFormData({
                        ...formData,
                        otherLinks: { ...formData.otherLinks, angellist: e.target.value }
                      })}
                      placeholder="https://angel.co/company/..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.otherLinks.github}
                      onChange={(e) => setFormData({
                        ...formData,
                        otherLinks: { ...formData.otherLinks, github: e.target.value }
                      })}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Portfolio/Other
                    </label>
                    <input
                      type="url"
                      value={formData.otherLinks.website2}
                      onChange={(e) => setFormData({
                        ...formData,
                        otherLinks: { ...formData.otherLinks, website2: e.target.value }
                      })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Tips and Tricks */}
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <Lightbulb className="w-6 h-6 mr-2 text-orange-600" />
                  Tips & Tricks for Your Startup
                </h3>
                {formData.tipsAndTricks.map((tip, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => {
                        const newTips = [...formData.tipsAndTricks]
                        newTips[index] = e.target.value
                        setFormData({ ...formData, tipsAndTricks: newTips })
                      }}
                      placeholder="Add a useful tip or trick"
                      className="flex-1 px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    <button
                      onClick={() => {
                        const newTips = formData.tipsAndTricks.filter((_, i) => i !== index)
                        setFormData({ ...formData, tipsAndTricks: newTips })
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setFormData({ ...formData, tipsAndTricks: [...formData.tipsAndTricks, ''] })
                  }}
                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tip
                </button>
              </div>

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleSubmit(new Event('submit') as any)
                    setShowDetailsModal(false)
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Save All Details
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Feedback Button - Floating */}
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
