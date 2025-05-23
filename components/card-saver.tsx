"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import CardDisplay from "@/components/card-display"
import PinPad from "@/components/pin-pad"
import CardForm from "@/components/card-form"
import CardGrid from "@/components/card-grid"
import SecurityFeatures from "@/components/security-features"
import SuccessAnimation from "@/components/success-animation"
import UserProfile from "@/components/user-profile"
import CardCategories from "@/components/card-categories"
import CardStats from "@/components/card-stats"
import {
  CreditCard,
  Plus,
  Shield,
  Settings,
  Trash2,
  Info,
  Lock,
  Sparkles,
  Sun,
  Moon,
  User,
  Loader2,
  BarChart3,
  Tags,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { CardData } from "@/types/card"
import { preventScreenCapture } from "@/lib/security"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { saveCard, getCards, deleteCard, getUserProfile } from "@/lib/card-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CardSaver() {
  const [cards, setCards] = useState<(CardData & { id: string })[]>([])
  const [showAddCard, setShowAddCard] = useState(false)
  const [selectedCard, setSelectedCard] = useState<(CardData & { id: string }) | null>(null)
  const [showPinPad, setShowPinPad] = useState(false)
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("cards")
  const [showSuccess, setShowSuccess] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [displayName, setDisplayName] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user, signOut } = useAuth()
  const tabsRef = useRef<HTMLDivElement>(null)

  // Check scroll position for mobile tabs
  const checkScrollPosition = useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  // Scroll tabs left/right
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 120
      const newScrollLeft =
        direction === "left" ? tabsRef.current.scrollLeft - scrollAmount : tabsRef.current.scrollLeft + scrollAmount

      tabsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load cards and user profile
  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Load user profile first to get display name
        try {
          const profile = await getUserProfile()
          if (profile.display_name) {
            setDisplayName(profile.display_name)
          }
        } catch (profileError) {
          console.error("Failed to load profile:", profileError)
          // Continue loading cards even if profile fails
        }

        // Then load cards
        const loadedCards = await getCards()
        setCards(loadedCards)

        // Show welcome toast on first load
        if (loadedCards.length > 0) {
          toast({
            title: "Welcome back!",
            description: `You have ${loadedCards.length} saved cards.`,
          })
        }
      } catch (error) {
        console.error("Failed to load cards:", error)
        toast({
          title: "Error",
          description: "Failed to load your saved cards. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadData()
    }

    // Prevent screen capture - apply strictly
    preventScreenCapture()

    // Re-apply screenshot prevention every 5 seconds to ensure it stays active
    const preventionInterval = setInterval(() => {
      preventScreenCapture()
    }, 5000)

    return () => {
      clearInterval(preventionInterval)
    }
  }, [user])

  // Check scroll position on mount and resize
  useEffect(() => {
    checkScrollPosition()
    window.addEventListener("resize", checkScrollPosition)
    return () => window.removeEventListener("resize", checkScrollPosition)
  }, [checkScrollPosition])

  const handleSaveCard = async (card: CardData) => {
    try {
      setIsSaving(true)
      const savedCard = await saveCard(card)

      // Add the new card to the state
      setCards((prev) => [{ ...card, id: savedCard.id }, ...prev])

      setShowAddCard(false)
      setShowSuccess(true)

      // Hide success animation after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

      toast({
        title: "Card Saved Successfully",
        description: "Your card has been securely encrypted and saved to the cloud.",
      })
    } catch (error) {
      console.error("Error saving card:", error)
      toast({
        title: "Error",
        description: "Failed to save your card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const confirmDeleteCard = (id: string) => {
    setCardToDelete(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id)

      // Remove the card from the state
      setCards((prev) => prev.filter((card) => card.id !== id))

      toast({
        title: "Card Deleted",
        description: "Your card has been permanently removed.",
      })

      setDeleteMode(false)
    } catch (error) {
      console.error("Error deleting card:", error)
      toast({
        title: "Error",
        description: "Failed to delete your card. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmDeleteAllCards = () => {
    setShowDeleteAllConfirm(true)
  }

  const handleDeleteAllCards = async () => {
    try {
      await Promise.all(cards.map((card) => deleteCard(card.id)))
      setCards([])
      toast({
        title: "All Cards Deleted",
        description: "All your saved cards have been permanently removed.",
      })
    } catch (error) {
      console.error("Error deleting all cards:", error)
      toast({
        title: "Error",
        description: "Failed to delete all cards. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCardSelect = (card: CardData & { id: string }) => {
    if (deleteMode) return
    setSelectedCard(card)
    setShowPinPad(true)
  }

  const handlePinSuccess = () => {
    setShowPinPad(false)
    setShowCardDetails(true)

    toast({
      title: "PIN Verified",
      description: "Card details will be visible for 1 minute.",
    })

    // Auto-hide CVV after 1 minute
    setTimeout(() => {
      setShowCardDetails(false)
      toast({
        title: "Session Expired",
        description: "Card details have been hidden for security.",
      })
    }, 60000)
  }

  const handlePinCancel = () => {
    setShowPinPad(false)
    setSelectedCard(null)
  }

  // Memoize the theme toggle function to improve performance
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    toast({
      title: `${newTheme === "light" ? "Light" : "Dark"} Mode Activated`,
      description: `You've switched to ${newTheme} mode.`,
    })
  }, [resolvedTheme, setTheme])

  const handleProfileUpdate = (name: string) => {
    setDisplayName(name)
  }

  const filteredCards =
    activeCategory === "all"
      ? cards
      : cards.filter((card) => {
          // Simple categorization based on card number patterns
          if (activeCategory === "credit" && card.cardNumber.startsWith("4")) return true
          if (activeCategory === "debit" && card.cardNumber.startsWith("5")) return true
          if (activeCategory === "other" && !card.cardNumber.startsWith("4") && !card.cardNumber.startsWith("5"))
            return true
          return false
        })

  // If not mounted yet, don't render anything dependent on theme
  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center items-center mb-4">
          <motion.div
            initial={{ scale: 0.8, x: -20, opacity: 0 }}
            animate={{ scale: 1, x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="flex items-center"
          >
            <motion.img
              src="/logo.png"
              alt="Card Saver Logo"
              className="h-14 mr-3"
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
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">Card Saver</h1>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-purple-800 dark:text-purple-200 max-w-md mx-auto flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Lock className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-300" />
          </motion.div>
          Securely store and manage your payment cards with advanced encryption and security features
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <Sparkles className="h-4 w-4 ml-2 text-purple-600 dark:text-purple-300" />
          </motion.div>
        </motion.p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="transform transition-transform">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("profile")}
            className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <User className="h-4 w-4 mr-2" />
            </motion.div>
            {displayName || (user?.email ? user.email.split("@")[0] : "Profile")}
          </Button>
        </motion.div>

        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="transform transition-transform"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
            >
              {resolvedTheme === "dark" ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                  </motion.div>
                  Light
                </>
              ) : (
                <>
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                  </motion.div>
                  Dark
                </>
              )}
            </Button>
          </motion.div>

          {cards.length > 0 && activeTab === "cards" && !showAddCard && !showPinPad && !showCardDetails && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="transform transition-transform"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteMode(!deleteMode)}
                className={`${
                  deleteMode
                    ? "bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200"
                    : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                <motion.div
                  animate={
                    deleteMode
                      ? {
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    repeat: deleteMode ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                </motion.div>
                {deleteMode ? "Cancel" : "Delete"}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile Tabs with Horizontal Scrolling */}
        <div className="relative md:hidden mb-8">
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scrollTabs("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/90 rounded-full p-1 shadow-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scrollTabs("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/90 rounded-full p-1 shadow-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          )}

          <div
            ref={tabsRef}
            className="flex overflow-x-auto scrollbar-hide gap-2 px-6"
            onScroll={checkScrollPosition}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              { value: "cards", icon: CreditCard, label: "Cards" },
              { value: "categories", icon: Tags, label: "Categories" },
              { value: "stats", icon: BarChart3, label: "Stats" },
              { value: "security", icon: Shield, label: "Security" },
              { value: "settings", icon: Settings, label: "Settings" },
              { value: "profile", icon: User, label: "Profile" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-white/80 dark:bg-black/30 text-gray-800 dark:text-white"
                }`}
              >
                <motion.div
                  animate={
                    activeTab === tab.value
                      ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    repeat: activeTab === tab.value ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                </motion.div>
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Tabs */}
        <TabsList className="hidden md:grid w-full grid-cols-6 mb-8 bg-white/80 dark:bg-black/30 p-1 gap-1 rounded-lg">
          <TabsTrigger
            value="cards"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-800 dark:text-white text-sm"
          >
            <motion.div
              animate={{
                y: [0, -2, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <CreditCard className="mr-1 h-4 w-4" />
            </motion.div>
            My Cards
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-800 dark:text-white text-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <Tags className="mr-1 h-4 w-4" />
            </motion.div>
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-800 dark:text-white text-sm"
          >
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <BarChart3 className="mr-1 h-4 w-4" />
            </motion.div>
            Stats
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-800 dark:text-white text-sm"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <Shield className="mr-1 h-4 w-4" />
            </motion.div>
            Security
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-800 dark:text-white text-sm"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Settings className="mr-1 h-4 w-4" />
            </motion.div>
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-800 dark:text-white text-sm"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -2, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <User className="mr-1 h-4 w-4" />
            </motion.div>
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          {cards.length > 0 && !showAddCard && !showPinPad && !showCardDetails && (
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <div className="flex flex-wrap gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="transform transition-transform"
                >
                  <Button
                    variant={activeCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory("all")}
                    className={
                      activeCategory === "all"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                    }
                  >
                    All Cards
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="transform transition-transform"
                >
                  <Button
                    variant={activeCategory === "credit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory("credit")}
                    className={
                      activeCategory === "credit"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                    }
                  >
                    Credit
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="transform transition-transform"
                >
                  <Button
                    variant={activeCategory === "debit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory("debit")}
                    className={
                      activeCategory === "debit"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                    }
                  >
                    Debit
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="transform transition-transform"
                >
                  <Button
                    variant={activeCategory === "other" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory("other")}
                    className={
                      activeCategory === "other"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                    }
                  >
                    Other
                  </Button>
                </motion.div>
              </div>
              <div className="text-gray-800 dark:text-white text-sm">
                {filteredCards.length} {filteredCards.length === 1 ? "card" : "cards"} found
              </div>
            </div>
          )}

          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Loader2 className="h-10 w-10 mx-auto text-purple-500 mb-4" />
                  </motion.div>
                  <p className="text-gray-800 dark:text-white">Loading your cards...</p>
                </div>
              </div>
            ) : cards.length === 0 && !showAddCard ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-12 bg-white/90 dark:bg-black/20 text-gray-800 dark:text-white rounded-lg backdrop-blur-sm border border-purple-200/50 dark:border-white/10"
              >
                <div className="mb-4">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, -5, 0, 5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <CreditCard className="mx-auto h-16 w-16 opacity-50 mb-4 text-gray-600 dark:text-white" />
                  </motion.div>
                  <h3 className="text-xl font-medium">No Cards Saved</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Add your first card to get started</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                  whileTap={{ scale: 0.95, rotateY: 5 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Button
                    onClick={() => setShowAddCard(true)}
                    className="mt-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 hover:from-red-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <motion.div
                      animate={{ rotate: [0, 90, 180, 270, 360] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                    </motion.div>
                    Add Card
                  </Button>
                </motion.div>
              </motion.div>
            ) : null}

            {cards.length > 0 && !showAddCard && !showPinPad && !showCardDetails ? (
              <CardGrid
                cards={filteredCards}
                onCardSelect={handleCardSelect}
                onAddCard={() => setShowAddCard(true)}
                deleteMode={deleteMode}
                onDeleteCard={(index) => confirmDeleteCard(filteredCards[index].id)}
              />
            ) : null}

            {showAddCard && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <CardForm onSave={handleSaveCard} onCancel={() => setShowAddCard(false)} isSaving={isSaving} />
              </motion.div>
            )}

            {showPinPad && selectedCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4"
              >
                <PinPad
                  onSuccess={handlePinSuccess}
                  onCancel={handlePinCancel}
                  cardName={selectedCard.cardName}
                  onDeleteCard={() => confirmDeleteCard(selectedCard.id)}
                  selectedCard={selectedCard}
                />
              </motion.div>
            )}

            {showCardDetails && selectedCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4"
              >
                <div className="bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black p-6 rounded-xl shadow-2xl max-w-md w-full border border-purple-200/50 dark:border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Card Details</h3>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCardDetails(false)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        Close
                      </Button>
                    </motion.div>
                  </div>

                  <CardDisplay card={selectedCard} showDetails={true} />

                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-100 dark:bg-black/30 p-3 rounded-lg"
                      >
                        <div className="text-purple-600 dark:text-purple-300 text-xs">ATM PIN</div>
                        <div className="text-gray-800 dark:text-white font-mono text-lg">
                          {selectedCard.atmPin || "••••"}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-100 dark:bg-black/30 p-3 rounded-lg"
                      >
                        <div className="text-purple-600 dark:text-purple-300 text-xs">Security PIN</div>
                        <div className="text-gray-800 dark:text-white font-mono text-lg">{selectedCard.pin}</div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center text-center text-gray-600 dark:text-gray-400 text-sm bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-500/30 p-2 rounded-lg border"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      >
                        <Info className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                      </motion.div>
                      <p>CVV and sensitive details will be hidden automatically after 1 minute</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="categories">
          <CardCategories cards={cards} />
        </TabsContent>

        <TabsContent value="stats">
          <CardStats cards={cards} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityFeatures />
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-white/90 dark:bg-black/20 text-gray-800 dark:text-white">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Settings className="mr-2 h-5 w-5" />
                </motion.div>
                Settings
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-lg">Theme</h4>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, rotateY: 5 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Button
                        onClick={() => setTheme("dark")}
                        variant={resolvedTheme === "dark" ? "default" : "outline"}
                        className={
                          resolvedTheme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                        }
                      >
                        <motion.div
                          animate={{
                            rotate: [0, -10, 10, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                        >
                          <Moon className="mr-2 h-4 w-4" />
                        </motion.div>
                        Dark
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, rotateY: 5 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Button
                        onClick={() => setTheme("light")}
                        variant={resolvedTheme === "light" ? "default" : "outline"}
                        className={
                          resolvedTheme === "light"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                        }
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Sun className="mr-2 h-4 w-4" />
                        </motion.div>
                        Light
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-lg">Data Management</h4>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, rotateY: 5 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Button variant="destructive" onClick={confirmDeleteAllCards} disabled={cards.length === 0}>
                        <motion.div
                          animate={
                            cards.length > 0
                              ? {
                                  rotate: [0, 10, -10, 0],
                                  scale: [1, 1.1, 1],
                                }
                              : {}
                          }
                          transition={{
                            duration: 0.5,
                            repeat: cards.length > 0 ? Number.POSITIVE_INFINITY : 0,
                            repeatType: "reverse",
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                        </motion.div>
                        Delete All Cards
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-lg">About</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Card Saver is a secure application for storing and managing your payment cards. All data is
                    encrypted and stored securely in the cloud.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Version 3.0</p>
                  <p className="text-gray-600 dark:text-gray-300">Developed by Mohammed Maaz A</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <UserProfile user={user} signOut={signOut} onProfileUpdate={handleProfileUpdate} />
        </TabsContent>
      </Tabs>

      <footer className="mt-12 text-center text-purple-800 dark:text-purple-200 text-sm">
        <div className="flex items-center justify-center mb-2">
          <motion.img
            src="/logo.png"
            alt="Card Saver Logo"
            className="h-5 mr-2"
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
          <p>Developed by Mohammed Maaz A</p>
        </div>
        <p className="mt-1 text-purple-600/60 dark:text-purple-300/60">© {new Date().getFullYear()} Card Saver</p>
      </footer>

      <AnimatePresence>{showSuccess && <SuccessAnimation />}</AnimatePresence>

      {/* Delete Card Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              </motion.div>
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be undone and all card data will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cardToDelete) {
                  handleDeleteCard(cardToDelete)
                  setCardToDelete(null)
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Card
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Cards Confirmation Dialog */}
      <AlertDialog open={showDeleteAllConfirm} onOpenChange={setShowDeleteAllConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              </motion.div>
              Delete All Cards
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ALL your cards? This action cannot be undone and all your card data will
              be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllCards} className="bg-red-500 hover:bg-red-600 text-white">
              Delete All Cards
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
