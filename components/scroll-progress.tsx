"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / totalHeight) * 100
      setProgress(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background/20 backdrop-blur-sm md:hidden">
      <div 
        className="h-full bg-accent transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Section indicators */}
      <div className="absolute top-1 left-0 right-0 flex justify-between px-4">
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${progress >= 0 ? 'bg-accent' : 'bg-accent/30'}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${progress >= 25 ? 'bg-accent' : 'bg-accent/30'}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${progress >= 50 ? 'bg-accent' : 'bg-accent/30'}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${progress >= 75 ? 'bg-accent' : 'bg-accent/30'}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${progress >= 95 ? 'bg-accent' : 'bg-accent/30'}`} />
      </div>
    </div>
  )
}
