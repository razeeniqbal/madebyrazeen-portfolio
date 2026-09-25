"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn("w-16 h-8", className)} />
    )
  }

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark
          ? "bg-primary-900 border border-primary-800"
          : "bg-white border border-primary-200",
        className
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleTheme()
        }
      }}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark
              ? "transform translate-x-0 bg-primary-800"
              : "transform translate-x-8 bg-primary-100"
          )}
        >
          {isDark ? (
            <Moon
              className="w-4 h-4 text-white"
              strokeWidth={1.5}
            />
          ) : (
            <Sun
              className="w-4 h-4 text-gray-700"
              strokeWidth={1.5}
            />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark
              ? "bg-transparent"
              : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun
              className="w-4 h-4 text-gray-500"
              strokeWidth={1.5}
            />
          ) : (
            <Moon
              className="w-4 h-4 text-gray-900"
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </div>
  )
}
