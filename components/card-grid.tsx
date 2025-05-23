"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import CardDisplay from "@/components/card-display"
import { Plus, CreditCard, Search } from "lucide-react"
import type { CardData } from "@/types/card"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"

interface CardGridProps {
  cards: CardData[]
  onCardSelect: (card: CardData) => void
  onAddCard: () => void
  deleteMode: boolean
  onDeleteCard: (index: number) => void
}

export default function CardGrid({ cards, onCardSelect, onAddCard, deleteMode, onDeleteCard }: CardGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Memoize filtered cards for better performance
  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards

    return cards.filter(
      (card) =>
        card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.bankName && card.bankName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.cardHolderName && card.cardHolderName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [cards, searchTerm])

  return (
    <div className="mobile-optimized">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6 relative">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <Search className="h-4 w-4" />
        </motion.div>
        <Input
          type="text"
          placeholder="Search cards by name, bank, or holder..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-500 w-full smooth-scroll"
        />
      </motion.div>

      {filteredCards.length === 0 && searchTerm !== "" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 bg-black/20 rounded-lg"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 0, 5, 0],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <CreditCard className="h-12 w-12 mx-auto text-gray-500 mb-3" />
          </motion.div>
          <p className="text-gray-300">No cards found matching "{searchTerm}"</p>
          <Button variant="link" onClick={() => setSearchTerm("")} className="text-purple-400 mt-2">
            Clear search
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredCards.map((card, index) => (
            <motion.div
              key={`${card.cardName}-${index}`}
              whileHover={{
                scale: deleteMode ? 1 : 1.03,
                rotateY: deleteMode ? 0 : 5,
                z: deleteMode ? 0 : 10,
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.05, duration: 0.3 },
              }}
              className={`cursor-pointer hardware-accelerated ${deleteMode ? "border-2 border-dashed border-red-500/50 rounded-xl p-1" : ""}`}
              onClick={() => onCardSelect(card)}
              style={{ transformStyle: "preserve-3d" }}
            >
              <CardDisplay
                card={card}
                showDetails={false}
                deleteMode={deleteMode}
                onDelete={() => onDeleteCard(index)}
                index={index}
              />
            </motion.div>
          ))}

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.95, rotateY: 5 }}
            className="flex justify-center items-center hardware-accelerated"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Button
              onClick={onAddCard}
              className="h-full min-h-[180px] w-full bg-gradient-to-br from-black/30 to-black/10 hover:from-black/40 hover:to-black/20 backdrop-blur-sm border-2 border-dashed border-purple-400/30 rounded-xl text-white transform transition-all duration-300 enhanced-animation"
            >
              <motion.div
                animate={{
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Plus className="mr-2 h-6 w-6" />
              </motion.div>
              Add New Card
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
