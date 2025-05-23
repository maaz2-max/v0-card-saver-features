"use client"

import { useAuth } from "@/components/auth-provider"
import CardSaver from "@/components/card-saver"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-red-100 dark:from-purple-900 dark:via-blue-800 dark:to-red-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-500 mb-4" />
          <p className="text-gray-800 dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to landing page if not logged in
    window.location.href = "/landing"
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-red-100 dark:from-purple-900 dark:via-blue-800 dark:to-red-900 pattern-grid-lg pattern-blue-500/10 pattern-opacity-10">
      <CardSaver />
    </main>
  )
}
