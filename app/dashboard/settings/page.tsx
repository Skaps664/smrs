"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useReadOnly } from "@/contexts/ReadOnlyContext"
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Building2, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  TrendingUp,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Trash2,
  AlertTriangle
} from "lucide-react"

type Tab = "profile" | "security" | "role-specific" | "startup-management"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { isReadOnly, viewingStartupId } = useReadOnly()
  const [activeTab, setActiveTab] = useState<Tab>(isReadOnly ? "startup-management" : "profile")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [startupData, setStartupData] = useState({
    id: "",
    name: "",
    stage: "",
    hasMentor: false,
    hasInvestors: false,
  })

  const userRole = (session?.user as any)?.role || "STARTUP"

  // Profile form data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Security form data
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Role-specific form data
  const [roleData, setRoleData] = useState({
    // Startup
    currentStage: "",
    // Mentor
    mentorCompany: "",
    mentorLinkedin: "",
    mentorLocation: "",
    // Investor
    investorPortfolio: "",
    investorLocation: "",
  })

  useEffect(() => {
    if (isReadOnly && viewingStartupId) {
      // Viewing mode: fetch startup data and owner's profile
      fetchStartupDataForViewing()
    } else {
      // Normal mode: fetch user's own data
      fetchUserData()
      if (userRole === "STARTUP") {
        fetchStartupData()
      }
    }
  }, [isReadOnly, viewingStartupId])

  const fetchStartupDataForViewing = async () => {
    if (!viewingStartupId) return
    
    try {
      // Fetch the startup being viewed
      const response = await fetch(`/api/startup/${viewingStartupId}`)
      if (response.ok) {
        const startup = await response.json()
        setStartupData({
          id: startup.id,
          name: startup.name,
          stage: startup.stage,
          hasMentor: startup.mentorCount > 0,
          hasInvestors: startup.investorCount > 0,
        })
        
        // For read-only viewing, we show startup info but don't need profile data
        // since mentor/investor can't edit anything
      }
    } catch (err) {
      console.error("Error fetching startup data for viewing:", err)
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/settings/profile")
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        })
        setRoleData({
          currentStage: data.currentStage || "",
          mentorCompany: data.mentorCompany || "",
          mentorLinkedin: data.mentorLinkedin || "",
          mentorLocation: data.mentorLocation || "",
          investorPortfolio: data.investorPortfolio || "",
          investorLocation: data.investorLocation || "",
        })
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
    }
  }

  const fetchStartupData = async () => {
    try {
      const response = await fetch("/api/startup")
      if (response.ok) {
        const data = await response.json()
        if (data.startups && data.startups.length > 0) {
          const startup = data.startups[0]
          setStartupData({
            id: startup.id,
            name: startup.name,
            stage: startup.stage,
            hasMentor: startup.mentorCount > 0,
            hasInvestors: startup.investorCount > 0,
          })
        }
      }
    } catch (err) {
      console.error("Error fetching startup data:", err)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setSuccess("Profile updated successfully!")
      await update() // Update session
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (securityData.newPassword !== securityData.confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }

    if (securityData.newPassword.length < 6) {
      setError("New password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      setSuccess("Password changed successfully!")
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSpecificUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/settings/role-specific", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: userRole, ...roleData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings")
      }

      setSuccess("Settings updated successfully!")
      await update() // Update session
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStartupStageUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/settings/startup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupId: startupData.id,
          stage: roleData.currentStage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update startup")
      }

      setSuccess("Startup stage updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStartupDelete = async () => {
    if (deleteConfirmText !== startupData.name) {
      setError("Startup name doesn't match. Please type it correctly.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/settings/startup", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: startupData.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete startup")
      }

      setSuccess("Startup deleted successfully! Redirecting...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">
              {isReadOnly ? `Viewing: ${startupData.name} Settings` : "Settings"}
            </h1>
            <p className="text-orange-100">
              {isReadOnly ? "Read-only view of startup settings" : "Manage your account preferences"}
            </p>
          </div>
        </div>
      </div>

      {/* Read-only notice for mentor/investor */}
      {isReadOnly && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          You are viewing this startup's settings in read-only mode. You cannot make changes.
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm">
        <div className="border-b border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              disabled={isReadOnly}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
              } ${isReadOnly ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            {!isReadOnly && (
              <>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "security"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("role-specific")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "role-specific"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {userRole === "STARTUP" && <Building2 className="w-4 h-4 inline mr-2" />}
                  {userRole === "MENTOR" && <User className="w-4 h-4 inline mr-2" />}
                  {userRole === "INVESTOR" && <Briefcase className="w-4 h-4 inline mr-2" />}
                  {userRole === "STARTUP" ? "Startup" : userRole === "MENTOR" ? "Mentor" : "Investor"} Settings
                </button>
              </>
            )}
            {((userRole === "STARTUP" && startupData.id && !isReadOnly) || (isReadOnly && startupData.id)) && (
              <button
                onClick={() => setActiveTab("startup-management")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "startup-management"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Startup {isReadOnly ? "Info" : "Management"}
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className={`space-y-6 ${isReadOnly ? 'pointer-events-none opacity-60' : ''}`}>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Profile Information</h3>
                <p className="text-sm text-gray-400 mb-6">
                  {isReadOnly ? "Viewing startup owner's profile information" : "Update your personal information and contact details"}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-[#111]"
                      placeholder="your@email.com"
                      disabled
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+923001234567"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Profile Changes"}
              </button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Change Password</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Update your password to keep your account secure
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          )}

          {/* Role-Specific Tab */}
          {activeTab === "role-specific" && (
            <form onSubmit={handleRoleSpecificUpdate} className="space-y-6">
              {/* Startup Settings */}
              {userRole === "STARTUP" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Startup Settings</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Update your startup-specific information
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      Current Stage
                    </label>
                    <select
                      value={roleData.currentStage}
                      onChange={(e) => setRoleData({ ...roleData, currentStage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select stage...</option>
                      <option value="IDEATION">Ideation</option>
                      <option value="PROTOTYPE">Prototype</option>
                      <option value="VALIDATION">Validation</option>
                      <option value="INCUBATION">Incubation</option>
                      <option value="ACCELERATION">Acceleration</option>
                      <option value="GROWTH">Growth</option>
                      <option value="SCALE">Scale</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Update as your startup progresses through different stages
                    </p>
                  </div>
                </div>
              )}

              {/* Mentor Settings */}
              {userRole === "MENTOR" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Mentor Settings</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Update your mentor profile information
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={roleData.mentorCompany}
                        onChange={(e) => setRoleData({ ...roleData, mentorCompany: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Linkedin className="w-4 h-4 inline mr-1" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={roleData.mentorLinkedin}
                        onChange={(e) => setRoleData({ ...roleData, mentorLinkedin: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={roleData.mentorLocation}
                        onChange={(e) => setRoleData({ ...roleData, mentorLocation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Investor Settings */}
              {userRole === "INVESTOR" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Investor Settings</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Update your investor profile information
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        Portfolio / Investment Firm
                      </label>
                      <input
                        type="text"
                        value={roleData.investorPortfolio}
                        onChange={(e) => setRoleData({ ...roleData, investorPortfolio: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your portfolio or firm name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={roleData.investorLocation}
                        onChange={(e) => setRoleData({ ...roleData, investorLocation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {/* Startup Management Tab */}
          {activeTab === "startup-management" && userRole === "STARTUP" && (
            <div className="space-y-6">
              {/* Stage Update Section */}
              <form onSubmit={handleStartupStageUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Update Startup Stage</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Keep your startup stage up-to-date as you progress. This will be reflected across all pages.
                  </p>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-200">
                        <p className="font-semibold mb-1">Current Startup:</p>
                        <p><strong>{startupData.name}</strong></p>
                        <p className="mt-2">Current Stage: <strong>{startupData.stage}</strong></p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      Select New Stage
                    </label>
                    <select
                      value={roleData.currentStage}
                      onChange={(e) => setRoleData({ ...roleData, currentStage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select stage...</option>
                      <option value="IDEATION">Ideation</option>
                      <option value="PROTOTYPE">Prototype</option>
                      <option value="VALIDATION">Validation</option>
                      <option value="INCUBATION">Incubation</option>
                      <option value="ACCELERATION">Acceleration</option>
                      <option value="GROWTH">Growth</option>
                      <option value="SCALE">Scale</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      This will be updated across your entire profile
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? "Updating..." : "Update Stage"}
                </button>
              </form>

              {/* Delete Startup Section */}
              <div className="border-t-2 border-gray-700 pt-6">
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-200 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-300 mb-4">
                        Permanently delete your startup profile. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  {(startupData.hasMentor || startupData.hasInvestors) ? (
                    <div className="bg-red-500/15 border border-red-300 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div className="text-sm text-red-200">
                          <p className="font-semibold mb-2">Cannot Delete Startup</p>
                          <p className="mb-2">You cannot delete your startup because:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {startupData.hasMentor && <li>You have an active mentor</li>}
                            {startupData.hasInvestors && <li>You have active investors</li>}
                          </ul>
                          <p className="mt-3 font-semibold">
                            Please remove all mentors and investors from the "Mentors & Investors" page before deleting your startup.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete Startup Profile
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-[#1a1a1a] border-2 border-red-300 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-100 mb-3">
                              Are you absolutely sure? This will:
                            </p>
                            <ul className="text-sm text-gray-300 space-y-2 mb-4 list-disc list-inside">
                              <li>Permanently delete all your startup data</li>
                              <li>Remove all weekly and monthly tracker entries</li>
                              <li>Delete all KPI records and documents</li>
                              <li>Remove all feedback and timeline entries</li>
                              <li>This action is <strong>irreversible</strong></li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-100 mb-2">
                              Type <span className="text-red-600">{startupData.name}</span> to confirm:
                            </p>
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={`Type "${startupData.name}" exactly`}
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false)
                                setDeleteConfirmText("")
                              }}
                              className="flex-1 bg-gray-300 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleStartupDelete}
                              disabled={deleteConfirmText !== startupData.name || loading}
                              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-5 h-5" />
                              {loading ? "Deleting..." : "Confirm Delete"}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-400">Account Type</span>
            <span className="font-medium text-gray-100">
              {userRole === "STARTUP" ? "Startup Founder" : userRole === "MENTOR" ? "Mentor" : "Investor"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-400">Email</span>
            <span className="font-medium text-gray-100">{session?.user?.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-400">Member Since</span>
            <span className="font-medium text-gray-100">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
