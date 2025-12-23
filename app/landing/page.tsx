"use client"

import { HeroSectionSMRS } from "@/components/hero-section-smrs"
import { SignalsSectionSMRS } from "@/components/signals-section-smrs"
import { WorkSectionSMRS } from "@/components/work-section-smrs"
import { PrinciplesSectionSMRS } from "@/components/principles-section-smrs"
import { ColophonSectionSMRS } from "@/components/colophon-section-smrs"
import { SideNavSMRS } from "@/components/side-nav-smrs"
import { ScrollProgress } from "@/components/scroll-progress"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollProgress />
      <SideNavSMRS />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSectionSMRS />
        <SignalsSectionSMRS />
        <WorkSectionSMRS />
        <PrinciplesSectionSMRS />
        <ColophonSectionSMRS />
      </div>
    </main>
  )
}
