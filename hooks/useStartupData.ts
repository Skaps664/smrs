"use client"

import { useEffect, useState } from "react"
import { useReadOnly } from "@/contexts/ReadOnlyContext"

export function useStartupData() {
  const { isReadOnly, viewingStartupId } = useReadOnly()
  const [startup, setStartup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStartup()
  }, [viewingStartupId, isReadOnly])

  const fetchStartup = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let url: string
      
      if (isReadOnly && viewingStartupId) {
        // Viewing mode: fetch specific startup by ID
        url = `/api/startup/${viewingStartupId}`
      } else {
        // Normal mode: fetch user's own startup
        url = `/api/startup`
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch startup: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Handle different response formats
      if (isReadOnly && viewingStartupId) {
        // Direct startup object
        setStartup(data)
      } else {
        // Array of startups or object with startups property
        const startups = data.startups || data
        setStartup(Array.isArray(startups) && startups.length > 0 ? startups[0] : null)
      }
    } catch (err) {
      console.error("Error fetching startup:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch startup")
      setStartup(null)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchStartup()
  }

  return {
    startup,
    loading,
    error,
    refetch,
    isReadOnly,
    viewingStartupId,
  }
}
