"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        
        const getSession = async () => {
          setIsLoading(true)
          try {
            const { data, error } = await supabase.auth.getSession()
            if (error) {
              console.error("Error getting session:", error)
              throw error
            }

            setSession(data.session)
            setUser(data.session?.user ?? null)

            // Handle redirects based on authentication state
            if (data.session?.user) {
              // User is authenticated
              if (pathname?.startsWith("/auth/")) {
                router.push("/")
              }
            } else {
              // User is not authenticated
              if (!pathname?.startsWith("/auth/") && !pathname?.startsWith("/features") && !pathname?.startsWith("/landing")) {
                router.push("/features")
              }
            }
          } catch (error) {
            console.error("Error getting session:", error)
            setSession(null)
            setUser(null)
            if (!pathname?.startsWith("/auth/") && !pathname?.startsWith("/features") && !pathname?.startsWith("/landing")) {
              router.push("/features")
            }
          } finally {
            setIsLoading(false)
          }
        }

        await getSession()

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email)

          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)

          // Handle authentication events
          if (event === "SIGNED_IN" && session) {
            console.log("User signed in, redirecting to dashboard")
            router.push("/")
          }

          if (event === "SIGNED_OUT") {
            console.log("User signed out, redirecting to features")
            router.push("/features")
          }

          if (event === "TOKEN_REFRESHED") {
            console.log("Token refreshed")
          }
        })

        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Failed to initialize Supabase:", error)
        setSupabaseError(error instanceof Error ? error.message : "Failed to initialize authentication")
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [router, pathname])

  const signOut = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
        throw error
      }

      // Clear local state
      setSession(null)
      setUser(null)

      // Redirect to features page
      router.push("/features")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show error state if Supabase failed to initialize
  if (supabaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-700 mb-4">
            Supabase is not properly configured. Please check your environment variables.
          </p>
          <p className="text-sm text-gray-500">
            Error: {supabaseError}
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}