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
import {
  Lock,
  Mail,
  UserPlus,
  Loader2,
  Shield,
  CreditCard,
  Database,
  Eye,
  Fingerprint,
  Cloud,
  CheckCircle,
  Smartphone,
  BarChart3,
  Tags,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFeatures, setShowFeatures] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const { user, isLoading: authLoading } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Bank-Grade Security",
      description: "Your card data is encrypted with military-grade encryption before storage.",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "All Card Types",
      description: "Store credit cards, debit cards, gift cards, and any payment cards securely.",
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Cloud Backup",
      description: "Access your cards from anywhere with secure cloud synchronization.",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "PIN Protection",
      description: "Your card details are protected by a 4-digit PIN that only you know.",
    },
    {
      icon: <Fingerprint className="h-5 w-5" />,
      title: "Auto-Hide Details",
      description: "Sensitive information automatically hides after 1 minute for security.",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices with responsive design.",
    },
  ]

  const benefits = [
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "Never lose your card details again",
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "Quick access when you need it most",
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "Organize cards by categories and banks",
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "Track expiry dates and get notifications",
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "View statistics about your cards",
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "Screenshot and screen recording protection",
    },
  ]

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Attempting to sign up with:", email)

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // Email is already confirmed, user can sign in
          toast({
            title: "Account created successfully!",
            description: "You can now sign in to your account.",
          })
          router.push("/auth/sign-in")
        } else {
          // Email confirmation required - show a more detailed message
          toast({
            title: "Check your email!",
            description: "Please check your email and click the verification link to activate your account.",
            duration: 6000, // Show for longer
          })

          // Show a more detailed message on the page
          setIsLoading(false)
          // Create a verification message element
          const verificationMessageDiv = document.createElement("div")
          verificationMessageDiv.className = "mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-center"
          verificationMessageDiv.innerHTML = `
            <h3 class="text-lg font-medium text-white mb-2">Verification Email Sent!</h3>
            <p class="text-white/80 mb-2">We've sent a verification link to <strong>${email}</strong></p>
            <ol class="text-white/80 text-sm text-left list-decimal pl-5 space-y-1">
              <li>Open your email inbox</li>
              <li>Click on the verification link in the email from Card Saver</li>
              <li>Return to this page and sign in with your email and password</li>
            </ol>
          `

          // Find the form and append the message after it
          const form = document.querySelector("form")
          if (form && form.parentNode) {
            form.parentNode.appendChild(verificationMessageDiv)
          }

          // Don't redirect yet - let them see the message
          return
        }
      }
    } catch (error) {
      console.error("Unexpected sign up error:", error)
      toast({
        title: "Sign up failed",
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 mx-auto text-purple-500 mb-4" />
          </motion.div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if user is already authenticated
  if (user) {
    return null
  }

  // Animation variants for the floating cards
  const floatingCards = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: 0.6,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-red-100 dark:from-purple-900 dark:via-blue-800 dark:to-red-900 pattern-grid-lg pattern-blue-500/10 pattern-opacity-10 p-4 overflow-hidden">
      {/* Animated floating cards in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl w-40 h-24 backdrop-blur-sm border border-white/10"
            initial="initial"
            animate="animate"
            custom={i}
            variants={floatingCards}
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              rotate: `${Math.random() * 20 - 10}deg`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <motion.img
                src="/logo.png"
                alt="Card Saver Logo"
                className="h-12 mr-3"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <h1 className="text-3xl font-bold text-white">Card Saver</h1>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Secure Your Cards with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {" "}
                Advanced Protection
              </span>
            </h2>
            <p className="text-purple-200 text-lg mb-6">
              The most secure way to store and manage all your payment cards in one place.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="flex items-center text-white"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: index * 0.2,
                  }}
                >
                  {benefit.icon}
                </motion.div>
                <span className="ml-3">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-2 mr-3 mt-1"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: index * 0.3,
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-white text-sm">{feature.title}</h3>
                    <p className="text-purple-200 text-xs mt-1">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Create Your Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-purple-200"
            >
              Start securing your cards with advanced encryption
            </motion.p>
          </div>

          <Card className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl">
            <div className="mb-4 text-center">
              <p className="text-white/80 text-sm">
                After signing up, you'll receive a verification email. Click the link in the email to activate your
                account.
              </p>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                  </motion.div>
                  Email
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
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                  </motion.div>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white flex items-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                  </motion.div>
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
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
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Loader2 className="h-4 w-4 mr-2" />
                      </motion.div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                      </motion.div>
                      Create Account
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/sign-in" className="text-purple-400 hover:text-purple-300">
                    Sign in
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
            <p className="text-purple-200 text-sm flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <Shield className="h-4 w-4 mr-2" />
              </motion.div>
              Your data is encrypted and stored securely
            </p>
          </motion.div>

          {/* Quick Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex justify-center space-x-4"
          >
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className="bg-purple-600 rounded-full p-2 mx-auto mb-1"
              >
                <Tags className="h-4 w-4 text-white" />
              </motion.div>
              <p className="text-xs text-purple-200">Categories</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <motion.div
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="bg-blue-600 rounded-full p-2 mx-auto mb-1"
              >
                <BarChart3 className="h-4 w-4 text-white" />
              </motion.div>
              <p className="text-xs text-purple-200">Analytics</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  y: [0, -3, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className="bg-green-600 rounded-full p-2 mx-auto mb-1"
              >
                <Cloud className="h-4 w-4 text-white" />
              </motion.div>
              <p className="text-xs text-purple-200">Cloud Sync</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  )
}
