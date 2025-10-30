"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, X } from "lucide-react"
import { format } from "date-fns"

export default function WeeklyTrackerPage() {
  const [startup, setStartup] = useState<any>(null)
  const [trackers, setTrackers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    weekNumber: 1,
    month: format(new Date(), "MMMM"),
    year: new Date().getFullYear(),
    milestonesAchieved: [""],
    newActivities: [""],
    challenges: [""],
    actionsTaken: [""],
    nextGoals: [""],
    supportNeeded: [""],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const startupRes = await fetch("/api/startup")
      const startupData = await startupRes.json()
      if (startupData.length > 0) {
        setStartup(startupData[0])
        
        const trackersRes = await fetch(`/api/weekly?startupId=${startupData[0].id}`)
        const trackersData = await trackersRes.json()
        setTrackers(trackersData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const addField = (field: keyof typeof formData) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] as string[]), ""],
    })
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
        weekNumber: Number(formData.weekNumber),
        month: formData.month,
        year: Number(formData.year),
        milestonesAchieved: formData.milestonesAchieved.filter(Boolean),
        newActivities: formData.newActivities.filter(Boolean),
        challenges: formData.challenges.filter(Boolean),
        actionsTaken: formData.actionsTaken.filter(Boolean),
        nextGoals: formData.nextGoals.filter(Boolean),
        supportNeeded: formData.supportNeeded.filter(Boolean),
      }

      const res = await fetch("/api/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowForm(false)
        fetchData()
        // Reset form
        setFormData({
          weekNumber: 1,
          month: format(new Date(), "MMMM"),
          year: new Date().getFullYear(),
          milestonesAchieved: [""],
          newActivities: [""],
          challenges: [""],
          actionsTaken: [""],
          nextGoals: [""],
          supportNeeded: [""],
        })
      }
    } catch (error) {
      console.error("Error saving tracker:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a startup profile first</p>
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
        <label className="block text-sm font-medium">{label}</label>
        <button
          type="button"
          onClick={() => addField(field)}
          className="text-orange-600 text-sm hover:text-orange-700"
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
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            {(formData[field] as string[]).length > 1 && (
              <button
                type="button"
                onClick={() => removeField(field, index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
          <h1 className="text-2xl font-bold flex items-center text-gray-900">
            <Calendar className="w-7 h-7 mr-3 text-orange-600" />
            Weekly Progress Tracker
          </h1>
          <p className="text-gray-600 mt-1">Log your weekly activities and milestones</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">New Weekly Entry</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Week Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Week Number</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={formData.weekNumber}
                  onChange={(e) => setFormData({ ...formData, weekNumber: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Month</label>
                <input
                  type="text"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {renderArrayField("Milestones Achieved", "milestonesAchieved", "e.g., Completed product packaging design")}
            {renderArrayField("New Activities", "newActivities", "e.g., Started social media campaign")}
            {renderArrayField("Challenges Faced", "challenges", "e.g., Delay in supplier shipment")}
            {renderArrayField("Actions Taken", "actionsTaken", "e.g., Shifted supplier, increased QC checks")}
            {renderArrayField("Next Week Goals", "nextGoals", "e.g., Start influencer marketing")}
            {renderArrayField("Support Needed", "supportNeeded", "e.g., Need digital marketing expert")}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Weekly Tracker"}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {trackers.map((tracker) => (
          <div key={tracker.id} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">
              Week {tracker.weekNumber} - {tracker.month} {tracker.year}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracker.milestonesAchieved.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-gray-700 mb-2">Milestones Achieved:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {tracker.milestonesAchieved.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tracker.challenges.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-gray-700 mb-2">Challenges:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {tracker.challenges.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tracker.nextGoals.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-gray-700 mb-2">Next Goals:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {tracker.nextGoals.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tracker.supportNeeded.length > 0 && (
                <div>
                  <p className="font-medium text-sm text-gray-700 mb-2">Support Needed:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {tracker.supportNeeded.map((item: string, i: number) => (
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
