"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useStartupData } from "@/hooks/useStartupData"

export default function MonthlyTrackerPage() {
  const { startup, loading: startupLoading, isReadOnly } = useStartupData()
  const [trackers, setTrackers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    month: format(new Date(), "MMMM"),
    year: new Date().getFullYear(),
    summary: "",
    keyAchievements: [""],
    majorChallenges: [""],
    lessonsLearned: [""],
    nextMonthPlans: [""],
  })

  useEffect(() => {
    if (startup?.id) {
      fetchTrackers()
    }
  }, [startup])

  const fetchTrackers = async () => {
    if (!startup?.id) return
    try {
      const trackersRes = await fetch(`/api/monthly?startupId=${startup.id}`)
      const trackersData = await trackersRes.json()
      if (Array.isArray(trackersData)) {
        setTrackers(trackersData)
      } else {
        setTrackers([])
      }
    } catch (error) {
      console.error("Error fetching trackers:", error)
      setTrackers([])
    }
  }

  const fetchData = () => fetchTrackers()

  const addField = (field: keyof typeof formData) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), ""],
      })
    }
  }

  const removeField = (field: keyof typeof formData, index: number) => {
    const arr = formData[field] as string[]
    if (arr.length > 1) {
      setFormData({
        ...formData,
        [field]: arr.filter((_, i) => i !== index),
      })
    }
  }

  const updateField = (field: keyof typeof formData, index: number, value: string) => {
    const arr = [...(formData[field] as string[])]
    arr[index] = value
    setFormData({ ...formData, [field]: arr })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startup) return

    setLoading(true)
    try {
      const payload = {
        startupId: startup.id,
        month: formData.month,
        year: Number(formData.year),
        summary: formData.summary,
        keyAchievements: formData.keyAchievements.filter(Boolean),
        majorChallenges: formData.majorChallenges.filter(Boolean),
        lessonsLearned: formData.lessonsLearned.filter(Boolean),
        nextMonthPlans: formData.nextMonthPlans.filter(Boolean),
      }

      const res = await fetch("/api/monthly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowForm(false)
        fetchData()
        // Reset form
        setFormData({
          month: format(new Date(), "MMMM"),
          year: new Date().getFullYear(),
          summary: "",
          keyAchievements: [""],
          majorChallenges: [""],
          lessonsLearned: [""],
          nextMonthPlans: [""],
        })
      }
    } catch (error) {
      console.error("Error saving tracker:", error)
    } finally {
      setLoading(false)
    }
  }

  if (startupLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please create a startup profile first</p>
      </div>
    )
  }

  const renderArrayField = (
    label: string,
    field: keyof typeof formData,
    placeholder: string
  ) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-100">{label}</label>
        <button
          type="button"
          onClick={() => addField(field)}
          className="text-orange-600 text-sm hover:text-orange-400"
        >
          + Add More
        </button>
      </div>
      <div className="space-y-2">
        {(formData[field] as string[]).map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(field, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
            />
            {(formData[field] as string[]).length > 1 && (
              <button
                type="button"
                onClick={() => removeField(field, index)}
                className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-100">
            <Calendar className="w-7 h-7 mr-3 text-orange-600" />
            Monthly Progress Tracker
          </h1>
          <p className="text-gray-400 mt-1">Track your monthly achievements and learnings</p>
        </div>
        {!showForm && (
                    <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Monthly Tracker
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">New Monthly Entry</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Month/Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-100">Month</label>
                <input
                  type="text"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  placeholder="e.g., October"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-100">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-100">Monthly Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={4}
                placeholder="Overall summary of what happened this month..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
              />
            </div>

            {renderArrayField("Key Achievements", "keyAchievements", "e.g., Launched new product feature")}
            {renderArrayField("Major Challenges", "majorChallenges", "e.g., Supply chain delays")}
            {renderArrayField("Lessons Learned", "lessonsLearned", "e.g., Need better communication with suppliers")}
            {renderArrayField("Next Month Plans", "nextMonthPlans", "e.g., Expand to new market segment")}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Monthly Tracker"}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {trackers.map((tracker) => (
          <div key={tracker.id} className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-100">
              {tracker.month} {tracker.year}
            </h3>
            
            {tracker.summary && (
              <p className="text-gray-300 mb-4 italic">{tracker.summary}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracker.keyAchievements.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-amber-400 mb-2">✓ Key Achievements:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {tracker.keyAchievements.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tracker.majorChallenges.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-red-400 mb-2">✗ Major Challenges:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {tracker.majorChallenges.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tracker.lessonsLearned.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-orange-400 mb-2">💡 Lessons Learned:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {tracker.lessonsLearned.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tracker.nextMonthPlans.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-orange-400 mb-2">→ Next Month Plans:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {tracker.nextMonthPlans.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
