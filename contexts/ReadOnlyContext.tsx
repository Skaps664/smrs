"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"

interface ReadOnlyContextType {
  isReadOnly: boolean
  viewingStartupId: string | null
  viewingStartup: {
    name: string
    industry: string
    stage: string
    founderName: string
  } | null
  accessType: "MENTOR" | "INVESTOR" | null
  setViewingStartup: (startupId: string | null) => void
  clearViewingMode: () => void
}

const ReadOnlyContext = createContext<ReadOnlyContextType | undefined>(undefined)

export function ReadOnlyProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [viewingStartupId, setViewingStartupId] = useState<string | null>(null)
  const [viewingStartup, setViewingStartupData] = useState<any>(null)
  const [accessType, setAccessType] = useState<"MENTOR" | "INVESTOR" | null>(null)

  useEffect(() => {
    // Check if user is viewing as mentor/investor
    const userRole = (session?.user as any)?.role
    
    // Check URL params for startupId
    const startupIdFromUrl = searchParams.get("startupId")
    
    // Check sessionStorage for persisted viewing mode
    const storedStartupId = typeof window !== "undefined" 
      ? sessionStorage.getItem("viewingStartupId")
      : null

    const targetStartupId = startupIdFromUrl || storedStartupId

    if (targetStartupId && (userRole === "MENTOR" || userRole === "INVESTOR")) {
      setViewingStartupId(targetStartupId)
      setIsReadOnly(true)
      setAccessType(userRole)

      // Store in sessionStorage for persistence
      if (typeof window !== "undefined") {
        sessionStorage.setItem("viewingStartupId", targetStartupId)
      }

      // Fetch startup details
      fetchStartupDetails(targetStartupId)
    } else {
      setIsReadOnly(false)
      setViewingStartupId(null)
      setViewingStartupData(null)
      setAccessType(null)
      
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("viewingStartupId")
      }
    }
  }, [session, searchParams])

  const fetchStartupDetails = async (startupId: string) => {
    try {
      const response = await fetch(`/api/startup/${startupId}`)
      if (response.ok) {
        const data = await response.json()
        setViewingStartupData(data)
      }
    } catch (error) {
      console.error("Failed to fetch startup details:", error)
    }
  }

  const setViewingStartup = (startupId: string | null) => {
    if (startupId) {
      setViewingStartupId(startupId)
      setIsReadOnly(true)
      
      if (typeof window !== "undefined") {
        sessionStorage.setItem("viewingStartupId", startupId)
      }
      
      fetchStartupDetails(startupId)
    } else {
      clearViewingMode()
    }
  }

  const clearViewingMode = () => {
    setIsReadOnly(false)
    setViewingStartupId(null)
    setViewingStartupData(null)
    
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("viewingStartupId")
    }
  }

  return (
    <ReadOnlyContext.Provider
      value={{
        isReadOnly,
        viewingStartupId,
        viewingStartup,
        accessType,
        setViewingStartup,
        clearViewingMode,
      }}
    >
      {children}
    </ReadOnlyContext.Provider>
  )
}

export function useReadOnly() {
  const context = useContext(ReadOnlyContext)
  if (context === undefined) {
    throw new Error("useReadOnly must be used within a ReadOnlyProvider")
  }
  return context
}
