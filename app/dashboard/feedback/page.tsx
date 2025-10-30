"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Plus, X, Star } from "lucide-react"
import { format } from "date-fns"

export default function MentorFeedbackPage() {
  const [startup, setStartup] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    mentorName: "",
    mentorEmail: "",
    meetingDate: new Date().toISOString().split("T")[0],
    meetingNotes: "",
    feedback: "",
    assignedTasks: [""],
    progressScore: "",
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
        
        const feedbackRes = await fetch(`/api/feedback?startupId=${startupData[0].id}`)
        const feedbackData = await feedbackRes.json()
        setFeedbacks(feedbackData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startup) return

    setLoading(true)
    try {
      const payload = {
        startupId: startup.id,
        ...formData,
        assignedTasks: formData.assignedTasks.filter(Boolean),
      }

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowForm(false)
        fetchData()
        setFormData({
          mentorName: "",
          mentorEmail: "",
          meetingDate: new Date().toISOString().split("T")[0],
          meetingNotes: "",
          feedback: "",
          assignedTasks: [""],
          progressScore: "",
        })
      }
    } catch (error) {
      console.error("Error saving feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = () => {
    setFormData({
      ...formData,
      assignedTasks: [...formData.assignedTasks, ""],
    })
  }

  const removeTask = (index: number) => {
    if (formData.assignedTasks.length > 1) {
      setFormData({
        ...formData,
        assignedTasks: formData.assignedTasks.filter((_, i) => i !== index),
      })
    }
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...formData.assignedTasks]
    newTasks[index] = value
    setFormData({ ...formData, assignedTasks: newTasks })
  }

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a startup profile first</p>
      </div>
    )
  }

  const avgScore = feedbacks.length > 0
    ? feedbacks
        .filter(f => f.progressScore)
        .reduce((acc, f) => acc + f.progressScore, 0) / feedbacks.filter(f => f.progressScore).length
    : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-900">
            <MessageSquare className="w-7 h-7 mr-3 text-teal-600" />
            Mentor Feedback
          </h1>
          <p className="text-gray-600 mt-1">Log mentor meetings and track progress</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Feedback
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Meetings</p>
          <p className="text-2xl font-bold text-gray-900">{feedbacks.length}</p>
        </div>
        <div className="bg-teal-50 rounded-lg shadow-sm p-4 border border-teal-200">
          <p className="text-sm text-gray-600">Average Progress Score</p>
          <p className="text-2xl font-bold text-teal-700">
            {avgScore > 0 ? avgScore.toFixed(1) : "N/A"} / 10
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-orange-200">
          <p className="text-sm text-gray-600">Total Tasks Assigned</p>
          <p className="text-2xl font-bold text-blue-700">
            {feedbacks.reduce((acc, f) => acc + f.assignedTasks.length, 0)}
          </p>
        </div>
      </div>

      {/* Add Feedback Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Log Mentor Meeting</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Mentor Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.mentorName}
                  onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Mentor Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.mentorEmail}
                  onChange={(e) => setFormData({ ...formData, mentorEmail: e.target.value })}
                  placeholder="mentor@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Meeting Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Progress Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.progressScore}
                  onChange={(e) => setFormData({ ...formData, progressScore: e.target.value })}
                  placeholder="Rate your progress"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Meeting Notes
              </label>
              <textarea
                required
                value={formData.meetingNotes}
                onChange={(e) => setFormData({ ...formData, meetingNotes: e.target.value })}
                rows={4}
                placeholder="What was discussed in the meeting?"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Mentor Feedback
              </label>
              <textarea
                required
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                rows={4}
                placeholder="What feedback did the mentor provide?"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  Assigned Tasks
                </label>
                <button
                  type="button"
                  onClick={addTask}
                  className="text-teal-600 text-sm hover:text-teal-700"
                >
                  + Add Task
                </button>
              </div>
              <div className="space-y-2">
                {formData.assignedTasks.map((task, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={task}
                      onChange={(e) => updateTask(index, e.target.value)}
                      placeholder="e.g., Finalize pitch deck"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900"
                    />
                    {formData.assignedTasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
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
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Feedback"}
            </button>
          </form>
        </div>
      )}

      {/* Feedback History */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No mentor feedback logged yet</p>
            <p className="text-sm text-gray-500 mt-2">Add your first meeting to start tracking progress</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feedback.mentorName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(feedback.meetingDate), "MMMM dd, yyyy")}
                  </p>
                  {feedback.mentorEmail && (
                    <p className="text-sm text-gray-600 mt-1">{feedback.mentorEmail}</p>
                  )}
                </div>
                {feedback.progressScore && (
                  <div className="flex items-center gap-1 bg-teal-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-teal-600 fill-teal-600" />
                    <span className="font-semibold text-teal-700">
                      {feedback.progressScore}/10
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Meeting Notes</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{feedback.meetingNotes}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{feedback.feedback}</p>
                </div>

                {feedback.assignedTasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Tasks</h4>
                    <ul className="space-y-1">
                      {feedback.assignedTasks.map((task: string, i: number) => (
                        <li key={i} className="flex items-start text-gray-900">
                          <span className="mr-2 mt-1">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
