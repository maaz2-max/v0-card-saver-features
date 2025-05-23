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
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
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
          if (!pathname?.startsWith("/auth/")) {
            router.push("/auth/sign-in")
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
        setSession(null)
        setUser(null)
        if (!pathname?.startsWith("/auth/")) {
          router.push("/auth/sign-in")
        }
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

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
        console.log("User signed out, redirecting to sign-in")
        router.push("/auth/sign-in")
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
        throw error
      }

      // Clear local state
      setSession(null)
      setUser(null)

      // Redirect to sign-in page
      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
