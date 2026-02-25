"use client"

import { useState } from "react"
import { X, MessageSquare, Star, Send } from "lucide-react"
import { useReadOnly } from "@/contexts/ReadOnlyContext"

interface GiveFeedbackButtonProps {
  sectionId: string
  sectionName: string
}

export default function GiveFeedbackButton({ sectionId, sectionName }: GiveFeedbackButtonProps) {
  const { isReadOnly, accessType, viewingStartupId } = useReadOnly()
  const [showModal, setShowModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")
  const [suggestions, setSuggestions] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Only show for mentors in read-only mode
  if (!isReadOnly || accessType !== "MENTOR") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startupId: viewingStartupId,
          sectionId,
          sectionName,
          rating,
          feedback,
          suggestions,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit feedback")
      }

      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        setSuccess(false)
        setFeedback("")
        setSuggestions("")
        setRating(5)
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Give Feedback Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold z-50 hover:scale-105"
      >
        <MessageSquare className="w-5 h-5" />
        Give Feedback on {sectionName}
      </button>

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Give Feedback
                  </h2>
                  <p className="text-green-100 mt-1">Section: {sectionName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-[#1a1a1a]/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Feedback submitted successfully!
                </div>
              )}

              {/* Rating Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Rate this section (1-10)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#1f1f1f] rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Poor</span>
                    <span className="text-2xl font-bold text-green-600">{rating}/10</span>
                    <span className="text-xs text-gray-400">Excellent</span>
                  </div>
                  <div className="flex gap-1 justify-center">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Share your thoughts on this section's content, progress, and effectiveness..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Provide constructive feedback to help the startup improve
                </p>
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Suggestions for Improvement
                </label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Specific recommendations, action items, or next steps..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Optional: Suggest specific actions or improvements
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-[#111] font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>Processing...</>
                  ) : success ? (
                    <>Submitted!</>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
