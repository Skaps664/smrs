import { Suspense } from "react"
import { ReadOnlyProvider } from "@/contexts/ReadOnlyContext"
import { DashboardWrapper } from "@/components/dashboard-wrapper"
import { DashboardLayoutClient } from "./layout-client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardWrapper>
      <ReadOnlyProvider>
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
          <DashboardLayoutClient>
            {children}
          </DashboardLayoutClient>
        </Suspense>
      </ReadOnlyProvider>
    </DashboardWrapper>
  )
}
