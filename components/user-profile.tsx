"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { User, LogOut, Save, Mail, UserCircle, Loader2, CheckCircle, MessageSquare } from "lucide-react"
import { getUserProfile, updateUserProfile } from "@/lib/card-service"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserProfileProps {
  user: SupabaseUser | null
  signOut: () => Promise<void>
  onProfileUpdate: (displayName: string) => void
}

export default function UserProfile({ user, signOut, onProfileUpdate }: UserProfileProps) {
  const [displayName, setDisplayName] = useState("")
  const [currentDisplayName, setCurrentDisplayName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      setIsFetching(true)
      try {
        const profile = await getUserProfile()
        if (profile.display_name) {
          setDisplayName(profile.display_name)
          setCurrentDisplayName(profile.display_name)
          onProfileUpdate(profile.display_name)
        } else {
          // If no display name is set, use the first part of the email as default
          const defaultName = user.email ? user.email.split("@")[0] : ""
          setDisplayName(defaultName)
          // Don't set currentDisplayName yet since it's not saved
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile. Please refresh the page.",
          variant: "destructive",
        })

        // Set a default display name from email if profile fetch fails
        if (user.email) {
          const defaultName = user.email.split("@")[0]
          setDisplayName(defaultName)
        }
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [user, onProfileUpdate])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !displayName.trim()) return

    setIsLoading(true)
    setUpdateSuccess(false)

    try {
      await updateUserProfile(displayName)
      setCurrentDisplayName(displayName)
      onProfileUpdate(displayName)

      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openFeedbackLink = () => {
    window.open("https://chat.whatsapp.com/HlLyldgge3QBeI1bBax9WG", "_blank")
  }

  return (
    <Card className="light-mode-card">
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
          <UserCircle className="mr-2 h-6 w-6" />
          <h3 className="text-xl font-bold light-mode-text">Your Profile</h3>
        </motion.div>

        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold"
            >
              {currentDisplayName
                ? currentDisplayName.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || "U"}
            </motion.div>
          </div>

          <div className="dark:bg-black/30 light:bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2 dark:text-purple-400 light:text-purple-600" />
              <span className="text-sm dark:text-gray-300 light:text-gray-600">Email</span>
            </div>
            <p className="light-mode-text font-medium">{user?.email}</p>
          </div>

          {currentDisplayName && (
            <div className="dark:bg-black/30 light:bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="h-4 w-4 mr-2 dark:text-purple-400 light:text-purple-600" />
                <span className="text-sm dark:text-gray-300 light:text-gray-600">Display Name</span>
              </div>
              <p className="light-mode-text font-medium">{currentDisplayName}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="light-mode-text flex items-center">
                <User className="h-4 w-4 mr-2" /> {currentDisplayName ? "Update Display Name" : "Set Display Name"}
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="light-mode-input"
                disabled={isFetching}
              />
              {!currentDisplayName && (
                <p className="text-xs text-purple-400">
                  Setting a display name will make it appear instead of your email throughout the app
                </p>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.97, rotateY: 5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button
                type="submit"
                disabled={isLoading || !displayName.trim() || displayName === currentDisplayName || isFetching}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : updateSuccess ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {updateSuccess ? "Profile Updated!" : "Update Profile"}
              </Button>
            </motion.div>
          </form>

          <div className="pt-4 border-t dark:border-white/10 light:border-gray-200 space-y-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97, rotateY: 5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button
                variant="outline"
                onClick={openFeedbackLink}
                className="w-full dark:border-purple-500/30 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 light:border-purple-300 light:text-purple-600 light:hover:bg-purple-50 light:hover:text-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback & Support
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97, rotateY: 5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 light:border-red-300 light:text-red-600 light:hover:bg-red-50 light:hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  )
}
