"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Plus, X, Star, Filter, Tag } from "lucide-react"
import { format } from "date-fns"
import { useStartupData } from "@/hooks/useStartupData"
import MentorFeedbackButton from "@/components/MentorFeedbackButton"

const SECTION_OPTIONS = [
  { value: "all", label: "All Sections" },
  { value: "weekly-tracker", label: "Weekly Tracker" },
  { value: "monthly-tracker", label: "Monthly Tracker" },
  { value: "kpi-dashboard", label: "KPI Dashboard" },
  { value: "business-model", label: "Business Model" },
  { value: "value-proposition", label: "Value Proposition" },
  { value: "mvp-planning", label: "MVP Planning" },
  { value: "market-research", label: "Market Research" },
  { value: "timeline", label: "Timeline" },
  { value: "documents", label: "Documents" },
  { value: "general", label: "General Feedback" },
]

export default function MentorFeedbackPage() {
  const { startup, loading: startupLoading, isReadOnly } = useStartupData()
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<any[]>([])
  const [selectedSection, setSelectedSection] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [markingRead, setMarkingRead] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
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
    if (startup?.id) {
      fetchFeedbacks()
      fetchUnreadCount()
    }
  }, [startup])

  useEffect(() => {
    // Filter feedbacks based on selected section
    if (selectedSection === "all") {
      setFilteredFeedbacks(feedbacks)
    } else {
      setFilteredFeedbacks(
        feedbacks.filter((f) => f.sectionId === selectedSection || (!f.sectionId && selectedSection === "general"))
      )
    }
  }, [feedbacks, selectedSection])

  const fetchFeedbacks = async () => {
    if (!startup?.id) return
    
    try {
      const feedbackRes = await fetch(`/api/feedback?startupId=${startup.id}`)
      const feedbackData = await feedbackRes.json()
      
      // Handle both array response and error response
      if (Array.isArray(feedbackData)) {
        setFeedbacks(feedbackData)
      } else {
        console.error("Invalid feedback data:", feedbackData)
        setFeedbacks([])
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      setFeedbacks([])
    }
  }

  const fetchUnreadCount = async () => {
    if (!startup?.id || isReadOnly) return
    
    try {
      const res = await fetch(`/api/feedback/unread-count?startupId=${startup.id}`)
      const data = await res.json()
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Error fetching unread count:", error)
      setUnreadCount(0)
    }
  }

  const markAllAsRead = async () => {
    if (!startup?.id || isReadOnly) return
    
    const unreadFeedbacks = feedbacks.filter(f => !f.isRead)
    if (unreadFeedbacks.length === 0) return
    
    setMarkingRead(true)
    try {
      const res = await fetch("/api/feedback/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackIds: unreadFeedbacks.map(f => f.id),
          startupId: startup.id,
        }),
      })

      if (res.ok) {
        // Refresh data
        await fetchFeedbacks()
        await fetchUnreadCount()
      }
    } catch (error) {
      console.error("Error marking feedback as read:", error)
    } finally {
      setMarkingRead(false)
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
        fetchFeedbacks()
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
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-green-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">Log mentor meetings and track progress</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && !isReadOnly && (
            <button
              onClick={markAllAsRead}
              disabled={markingRead}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {markingRead ? "Marking..." : `Mark All as Read (${unreadCount})`}
            </button>
          )}
          {!showForm && !isReadOnly && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Feedback
            </button>
          )}
        </div>
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

      {/* Section Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Filter by Section:</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
          >
            {SECTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedback(s)
          </span>
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
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              {selectedSection === "all" 
                ? "No mentor feedback logged yet" 
                : `No feedback for ${SECTION_OPTIONS.find(o => o.value === selectedSection)?.label}`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {selectedSection === "all" 
                ? "Add your first meeting to start tracking progress" 
                : "Try selecting a different section"}
            </p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div 
              key={feedback.id} 
              className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
                !feedback.isRead && !isReadOnly ? 'border-l-4 border-l-green-600' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!feedback.isRead && !isReadOnly && (
                      <span className="inline-flex items-center justify-center w-2 h-2 bg-green-600 rounded-full">
                        <span className="sr-only">Unread</span>
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feedback.mentorName}
                    </h3>
                    {feedback.sectionName && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        <Tag className="w-3 h-3 mr-1" />
                        {feedback.sectionName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {format(new Date(feedback.meetingDate), "MMMM dd, yyyy")}
                  </p>
                  {feedback.mentorEmail && (
                    <p className="text-sm text-gray-600 mt-1">{feedback.mentorEmail}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {feedback.progressScore && (
                    <div className="flex items-center gap-1 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      <Star className="w-4 h-4 text-teal-600 fill-teal-600" />
                      <span className="font-semibold text-teal-700">
                        {feedback.progressScore}/10
                      </span>
                    </div>
                  )}
                  {feedback.rating && feedback.rating !== feedback.progressScore && (
                    <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                      <Star className="w-4 h-4 text-orange-600 fill-orange-600" />
                      <span className="font-semibold text-orange-700 text-sm">
                        Section: {feedback.rating}/10
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {feedback.meetingNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Meeting Notes</h4>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                      {feedback.meetingNotes}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {feedback.feedback}
                  </p>
                </div>

                {feedback.suggestions && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1 text-orange-600" />
                      Suggestions for Improvement
                    </h4>
                    <p className="text-gray-900 whitespace-pre-wrap bg-orange-50 p-3 rounded-lg border border-orange-200">
                      {feedback.suggestions}
                    </p>
                  </div>
                )}

                {feedback.assignedTasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Tasks</h4>
                    <ul className="space-y-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {feedback.assignedTasks.map((task: string, i: number) => (
                        <li key={i} className="flex items-start text-gray-900">
                          <span className="mr-2 mt-1 text-blue-600">•</span>
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

      {/* Mentor Feedback Button */}
      <MentorFeedbackButton
        section="Feedback Overview"
        sectionData={{
          startupName: startup?.name,
          totalFeedback: feedbacks.length,
          sections: Array.from(new Set(feedbacks.map(f => f.sectionName).filter(Boolean))),
        }}
      />
    </div>
  )
}
