"use client"

import { useState } from "react"
import { useReadOnly } from "@/contexts/ReadOnlyContext"
import { MessageSquare, X, Send } from "lucide-react"

interface MentorFeedbackButtonProps {
  section: string // e.g., "Weekly Tracker", "KPI Dashboard", "Profile"
  sectionData?: any // Optional data about what they're viewing
}

// Common sections and their typical headings
const SECTION_HEADINGS: Record<string, string[]> = {
  "Dashboard": ["Overview", "Metrics", "Progress", "General"],
  "Startup Profile": ["Basic Information", "Registration Details", "Contact Information", "Vision & Mission", "General"],
  "Weekly Tracker": ["Milestones", "Activities", "Challenges", "Goals", "Support Needed", "General"],
  "Monthly Tracker": ["Key Achievements", "Financial Metrics", "Team Updates", "Market Traction", "General"],
  "KPI Dashboard": ["Marketing Metrics", "Sales Metrics", "Product Metrics", "Operations", "General"],
  "Timeline": ["Milestones", "Deadlines", "Planning", "General"],
  "Market Research": ["Target Market", "Competitors", "Analysis", "Strategy", "General"],
  "MVP Planning": ["Features", "Development", "Testing", "Launch Plan", "General"],
  "Value Proposition": ["Customer Segments", "Value Propositions", "Channels", "Revenue Streams", "General"],
  "Business Model": ["Canvas Overview", "Revenue Model", "Cost Structure", "Key Resources", "General"],
  "Mentors & Investors": ["Collaboration", "Communication", "Expectations", "General"],
  "Documents": ["Organization", "Documentation Quality", "Completeness", "General"],
  "Feedback Overview": ["Previous Feedback", "Action Items", "Progress", "General"],
  "Reports": ["Data Quality", "Insights", "Presentation", "General"],
  "Settings": ["Configuration", "Account Management", "General"],
}

export default function MentorFeedbackButton({ section, sectionData }: MentorFeedbackButtonProps) {
  const { isReadOnly, viewingStartupId, accessType } = useReadOnly()
  const [showModal, setShowModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState(section)
  const [selectedHeading, setSelectedHeading] = useState("General")
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Get available headings for selected section
  const availableHeadings = SECTION_HEADINGS[selectedSection] || ["General"]

  // Only show for mentors viewing a startup
  if (!isReadOnly || accessType !== "MENTOR") {
    return null
  }

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please enter your feedback")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/mentor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupId: viewingStartupId,
          section: selectedSection,
          heading: selectedHeading,
          feedback,
          rating,
          sectionData,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          setShowModal(false)
          setFeedback("")
          setRating(0)
          setSelectedSection(section)
          setSelectedHeading("General")
          setSuccess(false)
        }, 2000)
      } else {
        alert("Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSectionChange = (newSection: string) => {
    setSelectedSection(newSection)
    setSelectedHeading("General") // Reset heading when section changes
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
        title="Give Feedback"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="hidden group-hover:inline-block text-sm font-medium pr-2">
          Give Feedback
        </span>
      </button>

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">Give Feedback</h2>
                <p className="text-sm text-gray-400 mt-1">Provide detailed feedback to help the startup grow</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {success ? (
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-200 mb-2">Feedback Submitted!</h3>
                  <p className="text-green-400">Your feedback has been sent to the startup team.</p>
                </div>
              ) : (
                <>
                  {/* Section Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Section *
                    </label>
                    <select
                      value={selectedSection}
                      onChange={(e) => handleSectionChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-[#1a1a1a]"
                    >
                      {Object.keys(SECTION_HEADINGS).map((sectionName) => (
                        <option key={sectionName} value={sectionName}>
                          {sectionName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Heading Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Specific Area/Heading *
                    </label>
                    <select
                      value={selectedHeading}
                      onChange={(e) => setSelectedHeading(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-[#1a1a1a]"
                    >
                      {availableHeadings.map((heading) => (
                        <option key={heading} value={heading}>
                          {heading}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      How would you rate this? (Optional)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            rating >= star
                              ? "bg-yellow-400 border-yellow-500 text-white"
                              : "bg-[#141414] border-gray-600 text-gray-400 hover:bg-[#1f1f1f]"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Your Feedback *
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder={`Share your thoughts about ${selectedHeading} in ${selectedSection}...`}
                    />
                  </div>

                  {/* Context Info */}
                  {sectionData && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-200 mb-2">Current Page Context:</p>
                      <pre className="text-xs text-blue-400 whitespace-pre-wrap">
                        {JSON.stringify(sectionData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-[#111] font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !feedback.trim()}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
