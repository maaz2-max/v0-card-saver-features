"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, CheckCircle2, Trash2 } from "lucide-react"
import type { CardData } from "@/types/card"
import { formatCardNumber, formatExpiryDate } from "@/lib/format"
import { toast } from "@/components/ui/use-toast"
import { generateCardBackground } from "@/lib/colors"
import { Button } from "@/components/ui/button"

interface CardDisplayProps {
  card: CardData
  showDetails: boolean
  deleteMode?: boolean
  onDelete?: () => void
  index?: number
}

export default function CardDisplay({ card, showDetails, deleteMode = false, onDelete, index }: CardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [copied, setCopied] = useState(false)

  const getCardTypeIcon = () => {
    if (card.cardNumber.startsWith("4")) {
      return "visa"
    } else if (card.cardNumber.startsWith("5")) {
      return "mastercard"
    } else if (card.cardNumber.startsWith("3")) {
      return "amex"
    } else if (card.cardNumber.startsWith("6")) {
      return "discover"
    }

    return "generic"
  }

  const copyCardNumber = () => {
    navigator.clipboard.writeText(card.cardNumber)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Card number has been copied",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const cardBackground = generateCardBackground(card.bankName || getCardTypeIcon())

  return (
    <motion.div
      className="perspective-1000 relative w-full h-56 cursor-pointer card-display"
      onClick={() => !deleteMode && !showDetails && setIsFlipped(!isFlipped)}
      whileHover={{ scale: deleteMode ? 1 : 1.02 }}
    >
      {deleteMode && (
        <motion.div
          className="absolute right-2 top-2 z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index ? index * 0.1 : 0 }}
        >
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete && onDelete()
            }}
          >
            <Trash2 size={14} />
          </Button>
        </motion.div>
      )}

      <motion.div
        className={`w-full h-full relative preserve-3d transition-all duration-500 ${isFlipped ? "rotate-y-180" : ""}`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-xl ${cardBackground} p-6 flex flex-col justify-between`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-white/70 text-xs uppercase mb-1">Bank</div>
              <div className="text-white font-medium">{card.bankName || "Bank"}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {getCardTypeIcon() === "visa" && <span className="text-white font-bold text-lg">VISA</span>}
              {getCardTypeIcon() === "mastercard" && (
                <div className="flex">
                  <div className="w-5 h-5 rounded-full bg-red-500 opacity-80"></div>
                  <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-80 -ml-3"></div>
                </div>
              )}
              {getCardTypeIcon() === "amex" && <span className="text-white font-bold text-xs">AMEX</span>}
              {getCardTypeIcon() === "discover" && <span className="text-white font-bold text-xs">DISCOVER</span>}
              {getCardTypeIcon() === "generic" && <span className="text-white font-bold text-xs">CARD</span>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="text-xl font-mono tracking-wider text-white">
                {showDetails ? formatCardNumber(card.cardNumber) : "•••• •••• •••• " + card.cardNumber.slice(-4)}
              </div>
              {showDetails && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    copyCardNumber()
                  }}
                  className="ml-2 text-white/70 hover:text-white"
                >
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </motion.button>
              )}
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-white/60 text-xs uppercase">Card Holder</div>
                <div className="text-white font-medium">{card.cardHolderName || card.cardName}</div>
              </div>

              <div>
                <div className="text-white/60 text-xs uppercase">Valid Thru</div>
                <div className="text-white font-mono">{showDetails ? formatExpiryDate(card.expiryDate) : "••/••"}</div>
              </div>

              {showDetails && card.cvv && (
                <div>
                  <div className="text-white/60 text-xs uppercase">CVV</div>
                  <div className="text-white font-mono">{card.cvv}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col">
          <div className="h-12 bg-black/30 mt-6"></div>
          <div className="px-6 py-4 flex-1 flex flex-col justify-center">
            <div className="bg-white/90 h-10 flex items-center justify-end px-4">
              <div className="font-mono text-gray-800">{showDetails && card.cvv ? card.cvv : "•••"}</div>
            </div>
            <div className="mt-6 text-white/70 text-xs">
              <p className="mb-1">Card Name: {card.cardName}</p>
              <p className="mb-1">Bank: {card.bankName || "Not specified"}</p>
              <p>This card is stored securely with encryption.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
