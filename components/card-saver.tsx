"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import type { CardData } from "@/types/card"
import { preventScreenCapture } from "@/lib/security"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { saveCard, getCards, deleteCard, getUserProfile } from "@/lib/card-service"

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
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Load cards and user profile from Supabase
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

  const handleSaveCard = async (card: CardData) => {
    try {
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
    }
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")

    toast({
      title: `${theme === "dark" ? "Light" : "Dark"} Mode Activated`,
      description: `You've switched to ${theme === "dark" ? "light" : "dark"} mode.`,
    })
  }

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
            <img src="/logo.png" alt="Card Saver Logo" className="h-14 mr-3" />
            <h1 className="text-4xl font-bold light-mode-text tracking-tight">Card Saver</h1>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-purple-200 dark:text-purple-200 light:text-purple-800 max-w-md mx-auto flex items-center justify-center"
        >
          <Lock className="h-4 w-4 mr-2 dark:text-purple-300 light:text-purple-600" />
          Securely store and manage your payment cards with advanced encryption and security features
          <Sparkles className="h-4 w-4 ml-2 dark:text-purple-300 light:text-purple-600" />
        </motion.p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="transform transition-transform">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("profile")}
            className="light-mode-button w-full sm:w-auto"
          >
            <User className="h-4 w-4 mr-2" />
            {displayName || (user?.email ? user.email.split("@")[0] : "Profile")}
          </Button>
        </motion.div>

        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="transform transition-transform"
          >
            <Button variant="outline" size="sm" onClick={toggleTheme} className="light-mode-button">
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 mr-2" /> Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" /> Dark
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
                className={`${deleteMode ? "bg-red-900/50 border-red-500" : ""} light-mode-button ${
                  deleteMode && theme === "light" ? "bg-red-100 text-red-800 border-red-500" : ""
                }`}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteMode ? "Cancel" : "Delete"}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 bg-black/30 dark:bg-black/30 bg-white/80 p-1 overflow-x-auto gap-1">
          <TabsTrigger
            value="cards"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white dark:text-white text-gray-800 text-xs md:text-sm"
          >
            <CreditCard className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">My Cards</span>
            <span className="sm:hidden">Cards</span>
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white dark:text-white text-gray-800 text-xs md:text-sm"
          >
            <Tags className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
            <span className="sm:hidden">Categ.</span>
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white dark:text-white text-gray-800 text-xs md:text-sm"
          >
            <BarChart3 className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Stats</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white dark:text-white text-gray-800 text-xs md:text-sm"
          >
            <Shield className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Secure</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white dark:text-white text-gray-800 text-xs md:text-sm"
          >
            <Settings className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white dark:text-white text-gray-800 text-xs md:text-sm"
          >
            <User className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
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
                        : "light-mode-button"
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
                        : "light-mode-button"
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
                        : "light-mode-button"
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
                        : "light-mode-button"
                    }
                  >
                    Other
                  </Button>
                </motion.div>
              </div>
              <div className="light-mode-text text-sm">
                {filteredCards.length} {filteredCards.length === 1 ? "card" : "cards"} found
              </div>
            </div>
          )}

          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-500 mb-4" />
                  <p className="light-mode-text">Loading your cards...</p>
                </div>
              </div>
            ) : cards.length === 0 && !showAddCard ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-12 light-mode-card rounded-lg backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-purple-200/50"
              >
                <div className="light-mode-text mb-4">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, -5, 0, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <CreditCard className="mx-auto h-16 w-16 opacity-50 mb-4 dark:text-white light:text-gray-600" />
                  </motion.div>
                  <h3 className="text-xl font-medium">No Cards Saved</h3>
                  <p className="dark:text-gray-300 light:text-gray-600 mt-2">Add your first card to get started</p>
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
                    <Plus className="mr-2 h-4 w-4" /> Add Card
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
                onDeleteCard={(index) => handleDeleteCard(filteredCards[index].id)}
              />
            ) : null}

            {showAddCard && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <CardForm onSave={handleSaveCard} onCancel={() => setShowAddCard(false)} />
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
                  onDeleteCard={() => {
                    handleDeleteCard(selectedCard.id)
                    setShowPinPad(false)
                    setSelectedCard(null)
                  }}
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
                <div className="bg-gradient-to-br from-gray-900 to-black dark:from-gray-900 dark:to-black light:from-gray-100 light:to-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-white/10 dark:border-white/10 light:border-purple-200/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold light-mode-text">Card Details</h3>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCardDetails(false)}
                        className="dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
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
                        className="dark:bg-black/30 light:bg-gray-100 p-3 rounded-lg"
                      >
                        <div className="dark:text-purple-300 light:text-purple-600 text-xs">ATM PIN</div>
                        <div className="light-mode-text font-mono text-lg">{selectedCard.atmPin || "••••"}</div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="dark:bg-black/30 light:bg-gray-100 p-3 rounded-lg"
                      >
                        <div className="dark:text-purple-300 light:text-purple-600 text-xs">Security PIN</div>
                        <div className="light-mode-text font-mono text-lg">{selectedCard.pin}</div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center text-center dark:text-gray-400 light:text-gray-600 text-sm dark:bg-red-900/20 light:bg-red-100 dark:border-red-500/30 light:border-red-300 p-2 rounded-lg border"
                    >
                      <Info className="h-4 w-4 mr-2 dark:text-red-400 light:text-red-500" />
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
          <Card className="light-mode-card">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center light-mode-text">
                <Settings className="mr-2 h-5 w-5" /> Settings
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-lg light-mode-text">Theme</h4>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, rotateY: 5 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Button
                        onClick={() => setTheme("dark")}
                        variant={theme === "dark" ? "default" : "outline"}
                        className={
                          theme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "light-mode-button"
                        }
                      >
                        <Moon className="mr-2 h-4 w-4" /> Dark
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, rotateY: 5 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Button
                        onClick={() => setTheme("light")}
                        variant={theme === "light" ? "default" : "outline"}
                        className={
                          theme === "light"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "light-mode-button"
                        }
                      >
                        <Sun className="mr-2 h-4 w-4" /> Light
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-lg light-mode-text">Data Management</h4>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, rotateY: 5 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete all cards? This action cannot be undone.")) {
                            // Delete all cards from Supabase
                            Promise.all(cards.map((card) => deleteCard(card.id)))
                              .then(() => {
                                setCards([])
                                toast({
                                  title: "All Cards Deleted",
                                  description: "All your saved cards have been permanently removed.",
                                })
                              })
                              .catch((error) => {
                                console.error("Error deleting all cards:", error)
                                toast({
                                  title: "Error",
                                  description: "Failed to delete all cards. Please try again.",
                                  variant: "destructive",
                                })
                              })
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete All Cards
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-lg light-mode-text">About</h4>
                  <p className="dark:text-gray-300 light:text-gray-600">
                    Card Saver is a secure application for storing and managing your payment cards. All data is
                    encrypted and stored securely in the cloud.
                  </p>
                  <p className="dark:text-gray-300 light:text-gray-600">Version 3.0</p>
                  <p className="dark:text-gray-300 light:text-gray-600">Developed by Mohammed Maaz A</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <UserProfile user={user} signOut={signOut} onProfileUpdate={handleProfileUpdate} />
        </TabsContent>
      </Tabs>

      <footer className="mt-12 text-center dark:text-purple-200 light:text-purple-800 text-sm">
        <div className="flex items-center justify-center mb-2">
          <img src="/logo.png" alt="Card Saver Logo" className="h-5 mr-2" />
          <p>Developed by Mohammed Maaz A</p>
        </div>
        <p className="mt-1 dark:text-purple-300/60 light:text-purple-600/60">© {new Date().getFullYear()} Card Saver</p>
      </footer>

      <AnimatePresence>{showSuccess && <SuccessAnimation />}</AnimatePresence>

      <Toaster />
    </div>
  )
}
