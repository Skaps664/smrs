"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardEntrance } from "@/components/dashboard-entrance"

interface DashboardWrapperProps {
  children: React.ReactNode
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { data: session } = useSession()
  const [showEntrance, setShowEntrance] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)

  useEffect(() => {
    // Check if this is a fresh login (check sessionStorage)
    const isNewLogin = sessionStorage.getItem("dashboard-entrance-shown") !== "true"
    
    if (isNewLogin && session?.user) {
      setShowEntrance(true)
      sessionStorage.setItem("dashboard-entrance-shown", "true")
    } else {
      setEntranceComplete(true)
    }
  }, [session])

  const handleEntranceComplete = () => {
    setShowEntrance(false)
    setEntranceComplete(true)
  }

  if (showEntrance) {
    return (
      <DashboardEntrance 
        onComplete={handleEntranceComplete}
        userName={session?.user?.name || "User"}
      />
    )
  }

  if (!entranceComplete) {
    return null
  }

  return <>{children}</>
}
