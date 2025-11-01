"use client"

import { useReadOnly } from "@/contexts/ReadOnlyContext"
import { Eye, X, Info } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReadOnlyBanner() {
  const { isReadOnly, viewingStartup, accessType, clearViewingMode } = useReadOnly()
  const router = useRouter()

  if (!isReadOnly || !viewingStartup) {
    return null
  }

  const handleExitReadOnly = () => {
    clearViewingMode()
    router.push("/my-startups")
  }

  return (
    <div className={`${
      accessType === "MENTOR" 
        ? "bg-gradient-to-r from-green-500 to-emerald-600" 
        : "bg-gradient-to-r from-blue-500 to-indigo-600"
    } text-white px-4 py-3 shadow-lg`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">
              {accessType === "MENTOR" ? "Mentoring" : "Investing"} Mode:
            </span>
            <span className="font-medium">
              {viewingStartup.name}
            </span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              {viewingStartup.stage}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded">
            <Info className="w-4 h-4" />
            <span>Read-only access</span>
            {accessType === "MENTOR" && <span>• Can give feedback</span>}
          </div>
          
          <button
            onClick={handleExitReadOnly}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
