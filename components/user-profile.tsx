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
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile. Please refresh the page.",
          variant: "destructive",
        })
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
    <Card className="bg-black/20 backdrop-blur-sm border-0 text-white">
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
          <UserCircle className="mr-2 h-6 w-6" />
          <h3 className="text-xl font-bold">Your Profile</h3>
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

          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-sm text-gray-300">Email</span>
            </div>
            <p className="text-white font-medium">{user?.email}</p>
          </div>

          {currentDisplayName && (
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="h-4 w-4 mr-2 text-purple-400" />
                <span className="text-sm text-gray-300">Display Name</span>
              </div>
              <p className="text-white font-medium">{currentDisplayName}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white flex items-center">
                <User className="h-4 w-4 mr-2" /> {currentDisplayName ? "Update Display Name" : "Set Display Name"}
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                disabled={isFetching}
              />
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

          <div className="pt-4 border-t border-white/10 space-y-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97, rotateY: 5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button
                variant="outline"
                onClick={openFeedbackLink}
                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
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
                className="w-full border-red-500/30 text-red-400 hover:bg-red-900/20 hover:text-red-300"
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
