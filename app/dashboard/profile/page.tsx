"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, Save } from "lucide-react"

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
  const [loading, setLoading] = useState(false)
  const [existing, setExisting] = useState<any>(null)
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
  })

  useEffect(() => {
    fetchStartup()
  }, [])

  const fetchStartup = async () => {
    try {
      const res = await fetch("/api/startup")
      const data = await res.json()
      if (data.length > 0) {
        const startup = data[0]
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
        })
      }
    } catch (error) {
      console.error("Error fetching startup:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center mb-6">
          <Building2 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">
            {existing ? "Edit" : "Create"} Startup Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Startup Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Founders (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={formData.founders}
                  onChange={(e) => setFormData({ ...formData, founders: e.target.value })}
                  placeholder="e.g., John Doe, Jane Smith"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Industry *</label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Technology, Healthcare"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Niche *</label>
                <input
                  type="text"
                  required
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="e.g., Mobile Apps, Medical Devices"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Stage *</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
          <div>
            <h2 className="text-lg font-semibold mb-4">Registration Details</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.secpRegistered}
                  onChange={(e) => setFormData({ ...formData, secpRegistered: e.target.checked })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium">SECP Registered</label>
                  {formData.secpRegistered && (
                    <input
                      type="text"
                      value={formData.secpNumber}
                      onChange={(e) => setFormData({ ...formData, secpNumber: e.target.value })}
                      placeholder="SECP Number"
                      className="w-full px-4 py-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.fbrRegistered}
                  onChange={(e) => setFormData({ ...formData, fbrRegistered: e.target.checked })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium">FBR Registered</label>
                  {formData.fbrRegistered && (
                    <input
                      type="text"
                      value={formData.ntnNumber}
                      onChange={(e) => setFormData({ ...formData, ntnNumber: e.target.value })}
                      placeholder="NTN Number"
                      className="w-full px-4 py-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.trademarkFiled}
                  onChange={(e) => setFormData({ ...formData, trademarkFiled: e.target.checked })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium">Trademark Filed</label>
                  {formData.trademarkFiled && (
                    <input
                      type="text"
                      value={formData.trademarkNumber}
                      onChange={(e) => setFormData({ ...formData, trademarkNumber: e.target.value })}
                      placeholder="Trademark Number"
                      className="w-full px-4 py-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Brand Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Vision</label>
                <textarea
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mission</label>
                <textarea
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Your catchy tagline"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? "Saving..." : existing ? "Update Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  )
}
