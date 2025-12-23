"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSectionSMRS() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center px-4 sm:px-6 md:pl-28 md:pr-12 py-20 md:py-0">
      <AnimatedNoise opacity={0.03} />

      {/* Mobile-only top branding */}
      <div className="md:hidden absolute top-8 left-4 right-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[var(--font-bebas)] text-2xl text-accent tracking-wide">JUST EASY STARTUP</h1>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Startup Management System</p>
          </div>
          <div className="border border-border px-3 py-1.5">
            <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">v.1.0</p>
          </div>
        </div>
      </div>

      {/* Left vertical labels - Hidden on mobile */}
      <div className="hidden md:block absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          eazstart
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full max-w-full">
        <SplitFlapAudioProvider>
          <div className="relative">
            <div className="overflow-x-auto">
              <SplitFlapText text="EAZSTART" speed={80} />
            </div>
            <div className="mt-4">
              <SplitFlapMuteToggle />
            </div>
          </div>
        </SplitFlapAudioProvider>

        <h2 className="font-[var(--font-bebas)] text-muted-foreground/60 text-[clamp(0.875rem,3vw,2rem)] mt-4 tracking-wide max-w-2xl">
          Planning, Management, Tracking & Reporting System
        </h2>

        <p className="mt-8 md:mt-12 max-w-md font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
          We build systems that scale, not just dashboards that display. Track your startup journey from ideation to growth with precision.
        </p>

        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            <ScrambleTextOnHover text="Start Building" as="span" duration={0.6} />
            <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </Link>
          <Link
            href="/login"
            className="text-center sm:text-left font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Floating info tag - Adjusted for mobile */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12">
        <div className="border border-border px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          v.1.0 / Production Ready
        </div>
      </div>
    </section>
  )
}
