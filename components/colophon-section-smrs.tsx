"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSectionSMRS() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const shapesRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -80,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Hero text stagger
      if (heroTextRef.current) {
        const lines = heroTextRef.current.querySelectorAll(".hero-line")
        gsap.from(lines, {
          y: 100,
          opacity: 0,
          rotationX: -20,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heroTextRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Floating shapes
      if (shapesRef.current) {
        const shapes = shapesRef.current.querySelectorAll(".floating-shape")
        shapes.forEach((shape, i) => {
          gsap.to(shape, {
            y: "random(-30, 30)",
            x: "random(-20, 20)",
            rotation: "random(-15, 15)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          })
        })
      }

      // Cards with 3D flip
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".feature-card")
        gsap.from(cards, {
          rotationY: -90,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Stats counter animation
      if (statsRef.current) {
        const statNumbers = statsRef.current.querySelectorAll(".stat-number")
        statNumbers.forEach((stat) => {
          gsap.from(stat, {
            textContent: 0,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          })
        })

        const statBoxes = statsRef.current.querySelectorAll(".stat-box")
        gsap.from(statBoxes, {
          scale: 0,
          rotation: 180,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Mission statement slide in
      if (missionRef.current) {
        gsap.from(missionRef.current, {
          x: -100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Grid columns
      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > div")
        gsap.from(columns, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Footer
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
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
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30 overflow-hidden"
    >
      {/* Animated background shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="floating-shape absolute top-20 left-[10%] w-32 h-32 border-2 border-orange-500/40"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="floating-shape absolute top-40 right-[15%] w-24 h-24 border-2 border-amber-500/40 rotate-45"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px) rotate(45deg)`,
          }}
        />
        <div
          className="floating-shape absolute bottom-32 left-[20%] w-40 h-40 rounded-full border-2 border-orange-400/30"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
        <div
          className="floating-shape absolute top-1/2 right-[5%] w-20 h-20 border-2 border-amber-600/40 rotate-12"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * 0.02}px) rotate(12deg)`,
          }}
        />
        <div className="floating-shape absolute bottom-20 right-[30%] w-16 h-16 bg-gradient-to-br from-orange-500/20 to-amber-500/20 blur-xl rounded-full" />
        <div className="floating-shape absolute top-60 left-[40%] w-28 h-28 bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-xl rounded-full" />
      </div>

      {/* Section header */}
      <div ref={headerRef} className="mb-20 relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500">04 / About</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-6xl md:text-8xl lg:text-9xl tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
          POWERING PAKISTAN'S STARTUPS
        </h2>
      </div>

      {/* Hero statement with dynamic text */}
      <div ref={heroTextRef} className="mb-28 max-w-6xl relative z-10">
        <div className="space-y-6 overflow-hidden">
          <p className="hero-line font-[var(--font-bebas)] text-3xl md:text-5xl lg:text-6xl text-foreground/95 leading-tight">
            WE DON'T JUST MANAGE STARTUPS.
          </p>
          <p className="hero-line font-[var(--font-bebas)] text-3xl md:text-5xl lg:text-6xl leading-tight">
            <span className="text-orange-500">WE ACCELERATE</span> THEM.
          </p>
          <p className="hero-line font-mono text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed mt-8">
            In the chaos of building something from nothing, founders in Pakistan need clarity and a robust starting point. eazstart is the ultimate operating system for modern startups — combining strategic frameworks, real-time analytics, and collaborative tools into one powerful platform that equips you to scale from idea to IPO.
          </p>
        </div>
      </div>

      {/* Feature highlight cards - New design with glassmorphism */}


      {/* Stats section - Compact inline design */}
      <div ref={statsRef} className="mb-28 max-w-4xl">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <div className="stat-box group flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-orange-600 group-hover:h-16 transition-all duration-300" />
            <div>
              <div className="stat-number font-[var(--font-bebas)] text-3xl text-orange-500 group-hover:text-orange-400 transition-colors duration-300">15+</div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Features</p>
            </div>
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-border/30" />

          <div className="stat-box group flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-amber-500 to-amber-600 group-hover:h-16 transition-all duration-300" />
            <div>
              <div className="stat-number font-[var(--font-bebas)] text-3xl text-amber-500 group-hover:text-amber-400 transition-colors duration-300">99.9%</div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Uptime</p>
            </div>
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-border/30" />

          <div className="stat-box group flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-600 to-orange-700 group-hover:h-16 transition-all duration-300" />
            <div>
              <div className="font-[var(--font-bebas)] text-3xl text-orange-600 group-hover:text-orange-500 transition-colors duration-300">24/7</div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Available</p>
            </div>
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-border/30" />

          <div className="stat-box group flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-amber-600 to-orange-600 group-hover:h-16 transition-all duration-300" />
            <div>
              <div className="font-[var(--font-bebas)] text-3xl text-amber-600 group-hover:text-amber-500 transition-colors duration-300">∞</div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Scale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission statement block */}
      <div ref={missionRef} className="mb-28 max-w-5xl relative">
        <div className="border-l-4 border-orange-500 pl-8 py-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-orange-500 mb-4 block">Our Mission</span>
          <h3 className="font-[var(--font-bebas)] text-3xl md:text-5xl text-foreground/95 mb-6 leading-tight">
            EMPOWERING PAKISTANI FOUNDERS TO BUILD THE FUTURE
          </h3>
          <p className="font-mono text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
            Every groundbreaking company started as an idea. We believe the difference between failure and success isn't
            just about the idea — it's about execution, clarity, and having the right starting point. eazstart
            eliminates friction in the startup journey, giving startups in Pakistan the best tools to focus on what truly matters: building products
            people love and creating lasting impact.
          </p>
        </div>

        {/* Quote accent */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-[1px] w-20 bg-gradient-to-r from-orange-500 to-transparent" />
          <span className="font-mono text-xs italic text-orange-500/80">"Built by founders, for founders."</span>
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
      <div ref={footerRef} className="mt-32 pt-16 border-t-2 border-orange-500/20 relative">
        {/* Gradient line accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-12">
          <div className="flex-1">
            <h4 className="font-[var(--font-bebas)] text-3xl md:text-4xl text-foreground/95 mb-4">
              READY TO ACCELERATE YOUR STARTUP?
            </h4>
            <p className="font-mono text-sm text-muted-foreground max-w-md">
              Join innovative founders across Pakistan who are building the future with eazstart. The best ever starting point for your startup. No credit card required to start.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-3 border-2 border-orange-500 px-8 py-4 font-mono text-xs uppercase tracking-widest text-orange-500 overflow-hidden hover:text-background transition-colors duration-300"
            >
              <span className="relative z-10">Start Free Trial</span>
              <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-orange-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center border-2 border-foreground/20 px-8 py-4 font-mono text-xs uppercase tracking-widest text-foreground hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
          <p className="font-mono text-xs text-muted-foreground">
            © 2025 eazstart. All rights reserved. Empowering startup ecosystems across Pakistan and beyond.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Built with</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-orange-500">Next.js</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-[10px] text-amber-500">Prisma</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-[10px] text-orange-600">MongoDB</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
