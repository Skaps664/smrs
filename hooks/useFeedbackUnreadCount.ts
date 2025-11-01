import { useState, useEffect } from "react"

export function useFeedbackUnreadCount(startupId: string | null, enabled: boolean = true) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchUnreadCount = async () => {
    if (!startupId || !enabled) {
      setUnreadCount(0)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/feedback/unread-count?startupId=${startupId}`)
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.unreadCount || 0)
      } else {
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()

    // Poll every 30 seconds for updates
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [startupId, enabled])

  return { unreadCount, loading, refetch: fetchUnreadCount }
}
