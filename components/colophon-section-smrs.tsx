"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSectionSMRS() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (contentRef.current) {
        gsap.from(contentRef.current.querySelectorAll("p"), {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(":scope > div")
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(":scope > div")
        gsap.from(statItems, {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > div")
        gsap.from(columns, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">04 / About</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">ABOUT EAZSTART</h2>
      </div>

      {/* Main about content */}
      <div ref={contentRef} className="mb-20 max-w-5xl">
        <p className="font-mono text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
          eazstart is your all-in-one startup management ecosystem — from first idea to funded scale. We've built the platform 
          that we wish existed when we started our own ventures. No more juggling spreadsheets, documents, and disconnected tools.
        </p>
        <p className="font-mono text-sm md:text-base text-foreground/80 leading-relaxed mb-8">
          Whether you're a solo founder validating an MVP, a team of co-founders building product-market fit, or an established 
          startup preparing for Series A — eazstart adapts to your stage and accelerates your growth with precision-built frameworks, 
          real-time analytics, and collaborative workspace designed specifically for the startup journey.
        </p>
        <p className="font-mono text-sm text-muted-foreground leading-relaxed">
          Built by founders, for founders. Trusted by innovators who refuse to settle for mediocre tools.
        </p>
      </div>

      {/* Feature highlight cards */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-6xl">
        <div className="group border border-border/50 p-6 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 bg-[#1a1a1a]">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 border border-accent/40 flex items-center justify-center font-[var(--font-bebas)] text-2xl text-accent shrink-0">
              01
            </div>
            <h3 className="font-[var(--font-bebas)] text-2xl text-gray-100 group-hover:text-accent transition-colors duration-300 flex-1">
              Structured Planning
            </h3>
          </div>
          <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4">
            Business Model Canvas, Value Proposition Canvas, Market Research frameworks, and MVP Planning tools — 
            all validated methodologies used by successful startups worldwide.
          </p>
          <ul className="space-y-2">
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Strategic Frameworks
            </li>
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Market Validation
            </li>
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Product Roadmapping
            </li>
          </ul>
        </div>

        <div className="group border border-border/50 p-6 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 bg-[#1a1a1a]">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 border border-accent/40 flex items-center justify-center font-[var(--font-bebas)] text-2xl text-accent shrink-0">
              02
            </div>
            <h3 className="font-[var(--font-bebas)] text-2xl text-gray-100 group-hover:text-accent transition-colors duration-300 flex-1">
              Real-Time Analytics
            </h3>
          </div>
          <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4">
            Track KPIs that matter, monitor milestones, measure weekly velocity, and analyze monthly growth metrics 
            with dashboards that provide actionable insights, not just pretty charts.
          </p>
          <ul className="space-y-2">
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Custom KPI Dashboards
            </li>
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Progress Tracking
            </li>
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Automated Reports
            </li>
          </ul>
        </div>

        <div className="group border border-border/50 p-6 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 bg-[#1a1a1a]">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 border border-accent/40 flex items-center justify-center font-[var(--font-bebas)] text-2xl text-accent shrink-0">
              03
            </div>
            <h3 className="font-[var(--font-bebas)] text-2xl text-gray-100 group-hover:text-accent transition-colors duration-300 flex-1">
              Team Collaboration
            </h3>
          </div>
          <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4">
            Invite co-founders, team members, mentors, and investors. Role-based access, feedback loops, 
            document sharing, and transparent communication — all in one secure workspace.
          </p>
          <ul className="space-y-2">
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Multi-Role Access
            </li>
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Feedback System
            </li>
            <li className="font-mono text-[10px] text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></span>
              Document Management
            </li>
          </ul>
        </div>
      </div>

      {/* Stats section */}
      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border border-border/30 bg-background/50 mb-20">
          <div className="text-center">
            <div className="font-[var(--font-bebas)] text-4xl md:text-5xl text-accent mb-2">15+</div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Core Features</p>
          </div>
          <div className="text-center">
            <div className="font-[var(--font-bebas)] text-4xl md:text-5xl text-accent mb-2">100%</div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Data Secure</p>
          </div>
          <div className="text-center">
            <div className="font-[var(--font-bebas)] text-4xl md:text-5xl text-accent mb-2">24/7</div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Access</p>
          </div>
          <div className="text-center">
            <div className="font-[var(--font-bebas)] text-4xl md:text-5xl text-accent mb-2">∞</div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Possibilities</p>
          </div>
        </div>

      {/* Multi-column layout */}
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12 border-t border-border/30 pt-16">
        {/* Platform */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Platform</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">eazstart</li>
            <li className="font-mono text-xs text-foreground/80">Startup System</li>
          </ul>
        </div>

        {/* Stack */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Stack</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">Next.js 15</li>
            <li className="font-mono text-xs text-foreground/80">Prisma ORM</li>
            <li className="font-mono text-xs text-foreground/80">MongoDB</li>
          </ul>
        </div>

        {/* Features */}
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Features</h4>
          <ul className="space-y-2 columns-1 md:columns-2">
            <li className="font-mono text-xs text-foreground/80">Business Model Canvas</li>
            <li className="font-mono text-xs text-foreground/80">Value Proposition</li>
            <li className="font-mono text-xs text-foreground/80">MVP Planning</li>
            <li className="font-mono text-xs text-foreground/80">Market Research</li>
            <li className="font-mono text-xs text-foreground/80">KPI Dashboard</li>
            <li className="font-mono text-xs text-foreground/80">Weekly Tracker</li>
            <li className="font-mono text-xs text-foreground/80">Monthly Reports</li>
            <li className="font-mono text-xs text-foreground/80">Timeline & Milestones</li>
            <li className="font-mono text-xs text-foreground/80">Document Management</li>
            <li className="font-mono text-xs text-foreground/80">Mentor Network</li>
            <li className="font-mono text-xs text-foreground/80">Investor Relations</li>
            <li className="font-mono text-xs text-foreground/80">Feedback System</li>
            <li className="font-mono text-xs text-foreground/80">Team Collaboration</li>
            <li className="font-mono text-xs text-foreground/80">Auto Reports</li>
            <li className="font-mono text-xs text-foreground/80">Profile Manager</li>
          </ul>
        </div>

        {/* Support */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Support</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">24/7 Available</li>
            <li className="font-mono text-xs text-foreground/80">Documentation</li>
          </ul>
        </div>

        {/* Links */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/register"
                className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200"
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Year */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Year</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">2025</li>
            <li className="font-mono text-xs text-foreground/80">Production</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="mt-24 pt-12 border-t border-border/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="font-mono text-xs text-muted-foreground">
            © 2025 eazstart. All rights reserved. Built for startups, by startup enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-3 border border-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent hover:bg-accent hover:text-background transition-all duration-200"
            >
              Launch Your Startup
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
