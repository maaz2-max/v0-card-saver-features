"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const { user, isLoading: authLoading } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Attempting to sign in with:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        console.error("Sign in error:", error)
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      if (data.user) {
        console.log("Sign in successful:", data.user.email)
        toast({
          title: "Signed in successfully",
          description: "Welcome back to Card Saver!",
        })

        // The AuthProvider will handle the redirect
      }
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-800 to-red-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-500 mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if user is already authenticated
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-red-100 dark:from-purple-900 dark:via-blue-800 dark:to-red-900 pattern-grid-lg pattern-blue-500/10 pattern-opacity-10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="flex justify-center mb-4"
          >
            <img src="/logo.png" alt="Card Saver Logo" className="h-16" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-purple-200"
          >
            Sign in to access your secure card vault
          </motion.p>
        </div>

        <Card className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center">
                <Mail className="h-4 w-4 mr-2" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white flex items-center">
                <Lock className="h-4 w-4 mr-2" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 hover:from-red-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </motion.div>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="text-purple-400 hover:text-purple-300">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-purple-200 text-sm">
            Securely store and manage your payment cards with advanced encryption
          </p>
        </motion.div>
      </motion.div>
      <Toaster />
    </div>
  )
}
