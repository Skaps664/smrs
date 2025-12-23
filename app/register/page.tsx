"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatedNoise } from "@/components/animated-noise"
import { ScrambleText } from "@/components/scramble-text"
import gsap from "gsap"
import { ArrowRight, ArrowLeft, User, Mail, Lock, Phone, Briefcase, TrendingUp, MapPin } from "lucide-react"

type UserRole = "STARTUP" | "MENTOR" | "INVESTOR"
type StartupStage = "IDEATION" | "PROTOTYPE" | "VALIDATION" | "INCUBATION" | "ACCELERATION" | "GROWTH" | "SCALE"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (formRef.current && titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      gsap.fromTo(
        formRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      )
    }
  }, [step])

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
        // Clear the entrance flag to show animation when they login
        sessionStorage.removeItem("dashboard-entrance-shown")
        router.push("/login?registered=true")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <AnimatedNoise opacity={0.03} />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="max-w-2xl w-full relative z-10">
        {/* Back to landing */}
        <Link
          href="/landing"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowRight className="w-3 h-3 rotate-180" />
          Back to home
        </Link>

        {/* Title */}
        <div ref={titleRef} className="mb-8">
          <h1 className="font-[var(--font-bebas)] text-5xl md:text-6xl tracking-tight mb-2">
            <ScrambleText text="CREATE ACCOUNT" duration={0.8} />
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Step {step} of 4 — {step === 1 ? "Basic Info" : step === 2 ? "Select Role" : step === 3 ? "Details" : "Contact"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 transition-all duration-500 ${
                  step >= s ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form */}
        <div ref={formRef}>
          {error && (
            <div className="border border-destructive bg-destructive/10 text-destructive px-4 py-3 font-mono text-xs mb-6">
              {error}
            </div>
          )}

          <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/60">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Role Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-6">Select Your Role</h2>
                
                <div
                  onClick={() => setRole("STARTUP")}
                  className={`group border p-6 cursor-pointer transition-all ${
                    role === "STARTUP"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <TrendingUp className={`w-8 h-8 mt-1 transition-colors ${role === "STARTUP" ? "text-accent" : "text-muted-foreground"}`} />
                    <div>
                      <h3 className="font-mono text-sm font-semibold mb-1">Startup Founder</h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        Track your startup journey and manage progress
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setRole("MENTOR")}
                  className={`group border p-6 cursor-pointer transition-all ${
                    role === "MENTOR"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <User className={`w-8 h-8 mt-1 transition-colors ${role === "MENTOR" ? "text-accent" : "text-muted-foreground"}`} />
                    <div>
                      <h3 className="font-mono text-sm font-semibold mb-1">Mentor</h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        Guide startups and provide feedback on their progress
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setRole("INVESTOR")}
                  className={`group border p-6 cursor-pointer transition-all ${
                    role === "INVESTOR"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Briefcase className={`w-8 h-8 mt-1 transition-colors ${role === "INVESTOR" ? "text-accent" : "text-muted-foreground"}`} />
                    <div>
                      <h3 className="font-mono text-sm font-semibold mb-1">Investor</h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        Monitor portfolio startups and track their metrics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Role-Specific Details */}
            {step === 3 && role === "STARTUP" && (
              <div className="space-y-6">
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-6">Startup Details</h2>
                
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Current Stage
                  </label>
                  <select
                    value={currentStage}
                    onChange={(e) => setCurrentStage(e.target.value as StartupStage)}
                    className="w-full px-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
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
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-6">Mentor Profile</h2>
                
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Company / Organization
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      value={mentorCompany}
                      onChange={(e) => setMentorCompany(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    LinkedIn Profile <span className="text-muted-foreground/60">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={mentorLinkedin}
                    onChange={(e) => setMentorLinkedin(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Location
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      value={mentorLocation}
                      onChange={(e) => setMentorLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && role === "INVESTOR" && (
              <div className="space-y-6">
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-6">Investor Profile</h2>
                
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Portfolio / Firm <span className="text-muted-foreground/60">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      value={investorPortfolio}
                      onChange={(e) => setInvestorPortfolio(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="Investment firm or portfolio details"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Location
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      value={investorLocation}
                      onChange={(e) => setInvestorLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Info */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-tight mb-6">Contact Information</h2>
                
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Pakistani Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                      placeholder="03001234567 or +923001234567"
                    />
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/60">
                    Format: 03XXXXXXXXX or +923XXXXXXXXX
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="group flex items-center gap-2 px-6 py-3 border border-border font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-accent transition-all"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="group ml-auto flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all border border-accent/20"
                >
                  Next
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="group ml-auto flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-accent/20"
                >
                  {loading ? "CREATING..." : "CREATE ACCOUNT"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign in link */}
          <div className="text-center">
            <p className="font-mono text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer tag */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 text-center">
            eazstart — just easy startup
          </p>
        </div>
      </div>
    </div>
  )
}
