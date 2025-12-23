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

export function ReadOnlyProviderClient({ children }: { children: ReactNode }) {
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
      fetch(`/api/startup/${targetStartupId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setViewingStartupData(data)
          }
        })
        .catch((err) => {
          console.error("Error fetching startup details:", err)
        })
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

  const setViewingStartup = (startupId: string | null) => {
    if (startupId) {
      setViewingStartupId(startupId)
      setIsReadOnly(true)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("viewingStartupId", startupId)
      }
    } else {
      clearViewingMode()
    }
  }

  const clearViewingMode = () => {
    setIsReadOnly(false)
    setViewingStartupId(null)
    setViewingStartupData(null)
    setAccessType(null)
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
