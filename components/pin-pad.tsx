"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkipBackIcon as Backspace, X, ShieldAlert, Lock, AlertTriangle, HelpCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { CardData } from "@/types/card"

interface PinPadProps {
  onSuccess: () => void
  onCancel: () => void
  onDeleteCard: () => void
  cardName: string
  selectedCard: CardData & { id: string }
}

function PinPad({ onSuccess, onCancel, onDeleteCard, cardName, selectedCard }: PinPadProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const [showForgotPin, setShowForgotPin] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1)
      }, 1000)
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false)
      setAttempts(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLocked, lockTimer])

  const handleDigitClick = (digit: number) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit)
    }
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setPin("")
  }

  const handleSubmit = () => {
    try {
      // Verify PIN against the selected card directly
      if (pin === selectedCard.pin) {
        setError("")
        setAttempts(0)
        onSuccess()
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setPin("")

        if (newAttempts >= 3) {
          setIsLocked(true)
          setLockTimer(30) // Lock for 30 seconds
          toast({
            title: "Too many attempts",
            description: "PIN pad is locked for 30 seconds",
            variant: "destructive",
          })
          setShowForgotPin(true)
        } else {
          setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`)
        }
      }
    } catch (error) {
      console.error("Error in PIN verification:", error)
      setError("An error occurred. Please try again.")
      setPin("")
    }
  }

  const handleForgotPin = () => {
    if (confirm("Are you sure you want to delete this card? This action cannot be undone.")) {
      onDeleteCard()
      toast({
        title: "Card Deleted",
        description: "Your card has been permanently removed.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-black/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-xl shadow-2xl max-w-xs w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Lock className="h-5 w-5 mr-2 text-purple-400" /> Enter PIN
        </h3>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-300 text-sm mb-2">Enter 4-digit PIN to view card details</p>

        {/* Card preview */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4 bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-white/10"
        >
          <div className="text-white font-medium">{cardName}</div>
          <div className="text-gray-400 text-xs mt-1">Card ending in {selectedCard.cardNumber.slice(-4)}</div>
        </motion.div>

        <div className="flex justify-center space-x-3 my-4">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-4 h-4 rounded-full ${i < pin.length ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-600"}`}
              animate={i < pin.length ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            ></motion.div>
          ))}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm flex items-center justify-center"
          >
            <ShieldAlert className="h-4 w-4 mr-1" /> {error}
          </motion.p>
        )}

        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-500/30 rounded-lg p-2 mt-2"
          >
            <p className="text-red-400 text-sm flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 mr-1" /> PIN pad locked. Try again in {lockTimer} seconds.
            </p>
          </motion.div>
        )}

        {showForgotPin && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleForgotPin}
              className="text-red-400 border-red-500/30 hover:bg-red-900/20 text-xs"
            >
              <HelpCircle className="h-3 w-3 mr-1" /> Forgot PIN? Delete Card
            </Button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <motion.button
            key={digit}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.9, rotateY: 10 }}
            onClick={() => !isLocked && handleDigitClick(digit)}
            disabled={isLocked}
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 hover:from-purple-800/50 hover:to-blue-800/50 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transform transition-all duration-200 hover:shadow-lg"
            style={{ transformStyle: "preserve-3d" }}
          >
            {digit}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          whileTap={{ scale: 0.9, rotateY: 10 }}
          onClick={handleClear}
          disabled={isLocked}
          className="bg-gradient-to-br from-red-900/50 to-red-800/50 hover:from-red-800/50 hover:to-red-700/50 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transform transition-all duration-200 hover:shadow-lg"
          style={{ transformStyle: "preserve-3d" }}
        >
          C
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          whileTap={{ scale: 0.9, rotateY: 10 }}
          onClick={() => !isLocked && handleDigitClick(0)}
          disabled={isLocked}
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 hover:from-purple-800/50 hover:to-blue-800/50 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transform transition-all duration-200 hover:shadow-lg"
          style={{ transformStyle: "preserve-3d" }}
        >
          0
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          whileTap={{ scale: 0.9, rotateY: 10 }}
          onClick={handleBackspace}
          disabled={isLocked}
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 hover:from-purple-800/50 hover:to-blue-800/50 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 transform transition-all duration-200 hover:shadow-lg"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Backspace className="h-5 w-5 mx-auto" />
        </motion.button>
      </div>

      <motion.div
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleSubmit}
          disabled={pin.length !== 4 || isLocked}
          className="w-full mt-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 hover:from-red-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          Verify
        </Button>
      </motion.div>
    </Card>
  )
}

export default PinPad