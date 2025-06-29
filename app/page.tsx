"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import CardSaver to avoid SSR issues
const CardSaver = dynamic(() => import("@/components/card-saver"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-red-100 dark:from-purple-900 dark:via-blue-800 dark:to-red-900">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-500 mb-4" />
        <p className="text-gray-800 dark:text-white">Loading Card Saver...</p>
      </div>
    </div>
  )
})

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to features page if not logged in
      router.push("/features")
    }
  }, [user, isLoading, router])

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
    return null // Will redirect in the useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-red-100 dark:from-purple-900 dark:via-blue-800 dark:to-red-900 pattern-grid-lg pattern-blue-500/10 pattern-opacity-10">
      <CardSaver />
    </main>
  )
}