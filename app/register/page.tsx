"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ChevronLeft, User, Briefcase, TrendingUp, Phone } from "lucide-react"

type UserRole = "STARTUP" | "MENTOR" | "INVESTOR"
type StartupStage = "IDEATION" | "PROTOTYPE" | "VALIDATION" | "INCUBATION" | "ACCELERATION" | "GROWTH" | "SCALE"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [role, setRole] = useState<UserRole | "">("")

  const [currentStage, setCurrentStage] = useState<StartupStage | "">("")
  const [mentorCompany, setMentorCompany] = useState("")
  const [mentorLinkedin, setMentorLinkedin] = useState("")
  const [mentorLocation, setMentorLocation] = useState("")
  const [investorPortfolio, setInvestorPortfolio] = useState("")
  const [investorLocation, setInvestorLocation] = useState("")

  const [phone, setPhone] = useState("")

  const validatePhone = (phone: string) => {
    const regex = /^(\+92|0)?[0-9]{10}$/
    return regex.test(phone.replace(/[\s-]/g, ''))
  }

  const formatPhoneForPakistan = (phone: string) => {
    const cleaned = phone.replace(/[\s-]/g, '')
    if (cleaned.startsWith('0')) {
      return '+92' + cleaned.substring(1)
    }
    if (!cleaned.startsWith('+92')) {
      return '+92' + cleaned
    }
    return cleaned
  }

  const handleNext = () => {
    setError("")

    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        setError("All fields are required")
        return
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
    }

    if (step === 2) {
      if (!role) {
        setError("Please select your role")
        return
      }
    }

    if (step === 3) {
      if (role === "STARTUP" && !currentStage) {
        setError("Please select your startup stage")
        return
      }
      if (role === "MENTOR") {
        if (!mentorCompany || !mentorLocation) {
          setError("Company and location are required")
          return
        }
      }
      if (role === "INVESTOR") {
        if (!investorLocation) {
          setError("Location is required")
          return
        }
      }
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    setError("")
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validatePhone(phone)) {
      setError("Please enter a valid Pakistani phone number")
      return
    }

    setLoading(true)

    try {
      const formattedPhone = formatPhoneForPakistan(phone)
      
      const payload: any = {
        name,
        email,
        password,
        role,
        phone: formattedPhone,
      }

      if (role === "STARTUP") {
        payload.currentStage = currentStage
      } else if (role === "MENTOR") {
        payload.mentorCompany = mentorCompany
        payload.mentorLinkedin = mentorLinkedin
        payload.mentorLocation = mentorLocation
      } else if (role === "INVESTOR") {
        payload.investorPortfolio = investorPortfolio
        payload.investorLocation = investorLocation
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
      } else {
        router.push("/login?registered=true")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join the startup ecosystem</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Role</h2>
              
              <div
                onClick={() => setRole("STARTUP")}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  role === "STARTUP"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center">
                  <TrendingUp className="w-10 h-10 text-orange-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-lg">Startup Founder</h3>
                    <p className="text-sm text-gray-600">
                      Track your startup journey and manage progress
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setRole("MENTOR")}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  role === "MENTOR"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center">
                  <User className="w-10 h-10 text-orange-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-lg">Mentor</h3>
                    <p className="text-sm text-gray-600">
                      Guide startups and provide feedback on their progress
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setRole("INVESTOR")}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  role === "INVESTOR"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center">
                  <Briefcase className="w-10 h-10 text-orange-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-lg">Investor</h3>
                    <p className="text-sm text-gray-600">
                      Monitor portfolio startups and track their metrics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && role === "STARTUP" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Startup Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stage
                </label>
                <select
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value as StartupStage)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              </div>
            </div>
          )}

          {step === 3 && role === "MENTOR" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentor Profile</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={mentorCompany}
                  onChange={(e) => setMentorCompany(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="url"
                  value={mentorLinkedin}
                  onChange={(e) => setMentorLinkedin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={mentorLocation}
                  onChange={(e) => setMentorLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>
          )}

          {step === 3 && role === "INVESTOR" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Investor Profile</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio / Investment Firm (Optional)
                </label>
                <input
                  type="text"
                  value={investorPortfolio}
                  onChange={(e) => setInvestorPortfolio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Investment firm or portfolio details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={investorLocation}
                  onChange={(e) => setInvestorLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pakistani Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="03001234567 or +923001234567"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 03XXXXXXXXX or +923XXXXXXXXX
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
