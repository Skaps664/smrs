import { Suspense, ReactNode } from "react"
import { ReadOnlyProviderClient, useReadOnly as useReadOnlyClient } from "./ReadOnlyContext-client"

export function ReadOnlyProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]">{children}</div>}>
      <ReadOnlyProviderClient>
        {children}
      </ReadOnlyProviderClient>
    </Suspense>
  )
}

export function useReadOnly() {
  return useReadOnlyClient()
}
