"use client"

import { useReadOnly } from "@/contexts/ReadOnlyContext"
import { ReactNode } from "react"
import { Lock } from "lucide-react"

interface ReadOnlyWrapperProps {
  children: ReactNode
  tooltip?: string
  showLockIcon?: boolean
}

/**
 * Wrapper component that disables child elements when in read-only mode
 * Use this to wrap buttons, forms, or interactive elements
 */
export function ReadOnlyWrapper({ 
  children, 
  tooltip = "This action is disabled in read-only mode",
  showLockIcon = false
}: ReadOnlyWrapperProps) {
  const { isReadOnly } = useReadOnly()

  if (!isReadOnly) {
    return <>{children}</>
  }

  return (
    <div className="relative group">
      <div className="pointer-events-none opacity-50">
        {children}
      </div>
      {showLockIcon && (
        <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      )}
      <div className="absolute inset-0 cursor-not-allowed" title={tooltip} />
    </div>
  )
}

interface ReadOnlyButtonProps {
  onClick?: () => void
  children: ReactNode
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  variant?: "primary" | "secondary" | "danger"
}

/**
 * Button component that automatically handles read-only mode
 */
export function ReadOnlyButton({ 
  onClick, 
  children, 
  className = "",
  type = "button",
  disabled = false,
  variant = "primary"
}: ReadOnlyButtonProps) {
  const { isReadOnly } = useReadOnly()

  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors"
  
  const variantClasses = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isReadOnly}
      className={`${baseClasses} ${variantClasses[variant]} ${className} disabled:cursor-not-allowed disabled:opacity-50`}
      title={isReadOnly ? "This action is disabled in read-only mode" : ""}
    >
      {children}
    </button>
  )
}
