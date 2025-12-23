"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatedNoise } from "@/components/animated-noise"
import { ScrambleText } from "@/components/scramble-text"
import gsap from "gsap"
import { ArrowRight, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Clear the entrance flag to show animation on next visit
        sessionStorage.removeItem("dashboard-entrance-shown")
        router.push("/dashboard")
        router.refresh()
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

      <div className="max-w-md w-full relative z-10">
        {/* Back to landing */}
        <Link
          href="/landing"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowRight className="w-3 h-3 rotate-180" />
          Back to home
        </Link>

        {/* Title */}
        <div ref={titleRef} className="mb-12">
          <h1 className="font-[var(--font-bebas)] text-5xl md:text-6xl tracking-tight mb-2">
            <ScrambleText text="SIGN IN" duration={0.8} />
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Access your startup dashboard
          </p>
        </div>

        {/* Form */}
        <div ref={formRef}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border border-destructive bg-destructive/10 text-destructive px-4 py-3 font-mono text-xs">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border text-foreground font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 px-6 font-mono text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 border border-accent/20"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="font-mono text-xs text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent hover:underline font-semibold">
                Create one
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
