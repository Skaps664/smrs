"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2, UserPlus, Building2 } from "lucide-react"

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [invite, setInvite] = useState<any>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "authenticated" && session?.user) {
      validateInvite()
    } else {
      setLoading(false)
    }
  }, [status, session])

  const validateInvite = async () => {
    try {
      const response = await fetch(`/api/invite/validate/${params.token}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid or expired invite")
        setLoading(false)
        return
      }

      setInvite(data.invite)
      setLoading(false)
    } catch (error) {
      setError("Failed to validate invite")
      setLoading(false)
    }
  }

  const acceptInvite = async () => {
    setAccepting(true)
    setError("")

    try {
      const response = await fetch(`/api/invite/accept/${params.token}`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to accept invite")
        setAccepting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        // Redirect to read-only dashboard with startup context
        router.push(`/dashboard?startupId=${data.startupId}`)
      }, 2000)
    } catch (error) {
      setError("Something went wrong")
      setAccepting(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Validating invite...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <UserPlus className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You've Been Invited!</h1>
            <p className="text-gray-600">
              Please sign in or create an account to accept this invitation
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={`/login?redirect=/invite/${params.token}`}
              className="block w-full bg-orange-600 text-white text-center py-3 rounded-lg hover:bg-orange-700 font-medium"
            >
              Sign In
            </Link>
            <Link
              href={`/register?redirect=/invite/${params.token}`}
              className="block w-full border-2 border-orange-600 text-orange-600 text-center py-3 rounded-lg hover:bg-orange-50 font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Successfully Joined!</h1>
          <p className="text-gray-600 mb-6">
            You now have access to the startup dashboard. Redirecting...
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-orange-600 mx-auto" />
        </div>
      </div>
    )
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite</h1>
          <p className="text-gray-600 mb-6">
            {error || "This invite link is invalid, expired, or has already been used."}
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <Building2 className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Startup</h1>
          <p className="text-gray-600">
            You've been invited to join <span className="font-semibold">{invite.startup.name}</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-semibold text-gray-900">
                {invite.inviteType === "MENTOR" ? "Mentor" : "Investor"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Startup:</span>
              <span className="font-semibold text-gray-900">{invite.startup.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Industry:</span>
              <span className="font-semibold text-gray-900">{invite.startup.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stage:</span>
              <span className="font-semibold text-gray-900">{invite.startup.stage}</span>
            </div>
          </div>
        </div>

        {invite.inviteType === "MENTOR" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>As a Mentor:</strong> You'll have read-only access to all startup data and can provide feedback on each section.
            </p>
          </div>
        )}

        {invite.inviteType === "INVESTOR" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>As an Investor:</strong> You'll have read-only access to view all startup metrics and progress, but cannot provide feedback.
            </p>
          </div>
        )}

        <button
          onClick={acceptInvite}
          disabled={accepting}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {accepting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Accepting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Accept Invitation
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By accepting, you agree to maintain confidentiality of all startup information
        </p>
      </div>
    </div>
  )
}
