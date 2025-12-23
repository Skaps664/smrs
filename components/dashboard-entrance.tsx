"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatedNoise } from "@/components/animated-noise"
import { SplitFlapText } from "@/components/split-flap-text"
import gsap from "gsap"

interface DashboardEntranceProps {
  onComplete: () => void
  userName?: string
}

export function DashboardEntrance({ onComplete, userName = "User" }: DashboardEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500)
      }
    })

    // Stage 0: Initial fade in
    timeline.to(containerRef.current, {
      opacity: 1,
      duration: 0.3,
    })

    // Stage 1: Show welcome message after split flap completes
    timeline.add(() => setStage(1), "+=3.5")

    // Stage 2: Show "Loading Dashboard" text
    timeline.add(() => setStage(2), "+=1.5")

    // Stage 3: Grid expansion animation
    timeline.to(".grid-expand", {
      scale: 1.5,
      opacity: 0,
      duration: 1,
      ease: "power2.in"
    }, "+=0.5")

    // Stage 4: Final fade out
    timeline.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
    })

    return () => {
      timeline.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center opacity-0"
    >
      <AnimatedNoise opacity={0.03} />
      <div className="grid-bg grid-expand fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 text-center max-w-4xl px-6">
        {/* Stage 0-1: Split flap welcome */}
        {stage === 0 && (
          <div>
            <SplitFlapText text="WELCOME" speed={60} />
          </div>
        )}

        {/* Stage 1: Welcome message */}
        {stage === 1 && (
          <div className="animate-fade-in">
            <h1 className="font-[var(--font-bebas)] text-6xl md:text-8xl tracking-tight text-accent mb-4">
              WELCOME BACK
            </h1>
            <p className="font-mono text-lg text-muted-foreground">
              {userName}
            </p>
          </div>
        )}

        {/* Stage 2: Loading dashboard */}
        {stage === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight mb-4">
              INITIALIZING
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "400ms" }} />
              </div>
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                LOADING DASHBOARD
              </p>
            </div>

            {/* Loading bars */}
            <div className="mt-12 space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground w-32 text-right">SYSTEM</span>
                <div className="flex-1 h-1 bg-border overflow-hidden">
                  <div className="h-full bg-accent animate-loading-bar" style={{ animationDelay: "0ms" }} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground w-32 text-right">DATA</span>
                <div className="flex-1 h-1 bg-border overflow-hidden">
                  <div className="h-full bg-accent animate-loading-bar" style={{ animationDelay: "200ms" }} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground w-32 text-right">INTERFACE</span>
                <div className="flex-1 h-1 bg-border overflow-hidden">
                  <div className="h-full bg-accent animate-loading-bar" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
