"use client"

import { useState, useEffect } from "react"
import { Target, CheckCircle2, Circle, Plus, X } from "lucide-react"

const stages = [
  { value: "IDEATION", label: "Ideation", color: "bg-gray-100 text-gray-700" },
  { value: "PROTOTYPE", label: "Prototype", color: "bg-orange-100 text-orange-700" },
  { value: "VALIDATION", label: "Validation", color: "bg-amber-100 text-amber-700" },
  { value: "INCUBATION", label: "Incubation", color: "bg-yellow-100 text-yellow-700" },
  { value: "ACCELERATION", label: "Acceleration", color: "bg-yellow-100 text-yellow-700" },
  { value: "GROWTH", label: "Growth", color: "bg-orange-100 text-orange-700" },
  { value: "SCALE", label: "Scale", color: "bg-red-100 text-red-700" },
]

export default function TimelinePage() {
  const [startup, setStartup] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    stage: "IDEATION",
    title: "",
    description: "",
    criteria: [""],
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
        
        const milestonesRes = await fetch(`/api/milestone?startupId=${startupData[0].id}`)
        const milestonesData = await milestonesRes.json()
        setMilestones(milestonesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const toggleMilestone = async (milestone: any) => {
    try {
      const res = await fetch("/api/milestone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: milestone.id,
          completed: !milestone.completed,
        }),
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error updating milestone:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startup) return

    setLoading(true)
    try {
      const payload = {
        startupId: startup.id,
        stage: formData.stage,
        title: formData.title,
        description: formData.description,
        criteria: formData.criteria.filter(Boolean),
        completed: false,
      }

      const res = await fetch("/api/milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowForm(false)
        fetchData()
        setFormData({
          stage: "IDEATION",
          title: "",
          description: "",
          criteria: [""],
        })
      }
    } catch (error) {
      console.error("Error saving milestone:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCriteria = () => {
    setFormData({
      ...formData,
      criteria: [...formData.criteria, ""],
    })
  }

  const removeCriteria = (index: number) => {
    if (formData.criteria.length > 1) {
      setFormData({
        ...formData,
        criteria: formData.criteria.filter((_, i) => i !== index),
      })
    }
  }

  const updateCriteria = (index: number, value: string) => {
    const newCriteria = [...formData.criteria]
    newCriteria[index] = value
    setFormData({ ...formData, criteria: newCriteria })
  }

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a startup profile first</p>
      </div>
    )
  }

  const getMilestonesByStage = (stage: string) => {
    return milestones.filter(m => m.stage === stage)
  }

  const completedCount = milestones.filter(m => m.completed).length
  const totalCount = milestones.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-900">
            <Target className="w-7 h-7 mr-3 text-orange-600" />
            Startup Timeline
          </h1>
          <p className="text-gray-600 mt-1">
            Track your progress through each stage - Current: <strong>{startup.stage}</strong>
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Milestone
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {completedCount} of {totalCount} milestones completed
        </p>
      </div>

      {/* Add Milestone Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Milestone</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
              >
                {stages.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Milestone Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Complete market research"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Optional details..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Success Criteria</label>
                <button
                  type="button"
                  onClick={addCriteria}
                  className="text-orange-600 text-sm hover:text-orange-700"
                >
                  + Add Criteria
                </button>
              </div>
              <div className="space-y-2">
                {formData.criteria.map((criteria, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={criteria}
                      onChange={(e) => updateCriteria(index, e.target.value)}
                      placeholder="e.g., Survey 50+ potential customers"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                    {formData.criteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCriteria(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Milestone"}
            </button>
          </form>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const stageMilestones = getMilestonesByStage(stage.value)
          const isCurrentStage = startup.stage === stage.value
          
          return (
            <div key={stage.value} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`px-4 py-2 rounded-full font-semibold ${stage.color}`}>
                    {stage.label}
                  </div>
                  {isCurrentStage && (
                    <span className="ml-3 text-xs bg-orange-500 text-white px-2 py-1 rounded">
                      Current Stage
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {stageMilestones.filter(m => m.completed).length} / {stageMilestones.length} completed
                </span>
              </div>

              {stageMilestones.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No milestones added for this stage</p>
              ) : (
                <div className="space-y-3">
                  {stageMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`border rounded-lg p-4 transition-all ${
                        milestone.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleMilestone(milestone)}
                          className="mt-1 flex-shrink-0"
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-medium ${milestone.completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                            {milestone.title}
                          </h4>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          )}
                          {milestone.criteria.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {milestone.criteria.map((criteria: string, i: number) => (
                                <li key={i} className="text-xs text-gray-500 flex items-center">
                                  <span className="mr-2">•</span>
                                  {criteria}
                                </li>
                              ))}
                            </ul>
                          )}
                          {milestone.completedDate && (
                            <p className="text-xs text-green-600 mt-2">
                              Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
