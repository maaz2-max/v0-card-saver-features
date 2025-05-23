"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BarChart3, PieChart, CreditCard, Calendar, AlertTriangle } from "lucide-react"
import type { CardData } from "@/types/card"

interface CardStatsProps {
  cards: (CardData & { id: string })[]
}

export default function CardStats({ cards }: CardStatsProps) {
  // Calculate statistics
  const totalCards = cards.length
  const creditCards = cards.filter((card) => card.cardNumber.startsWith("4")).length
  const debitCards = cards.filter((card) => card.cardNumber.startsWith("5")).length
  const otherCards = totalCards - creditCards - debitCards

  // Calculate expiring cards (cards expiring in the next 3 months)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // 1-12
  const currentYear = currentDate.getFullYear() % 100 // 0-99

  const expiringCards = cards.filter((card) => {
    const expiryMonth = Number.parseInt(card.expiryDate.substring(0, 2))
    const expiryYear = Number.parseInt(card.expiryDate.substring(2, 4))

    // Calculate months difference
    const monthsDiff = (expiryYear - currentYear) * 12 + (expiryMonth - currentMonth)

    // Return cards expiring in the next 3 months
    return monthsDiff >= 0 && monthsDiff <= 3
  })

  // Group by bank
  const bankDistribution = cards.reduce(
    (acc, card) => {
      const bankName = card.bankName || "Other"
      acc[bankName] = (acc[bankName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate percentages for the pie chart
  const calculatePercentage = (value: number) => {
    return totalCards > 0 ? Math.round((value / totalCards) * 100) : 0
  }

  return (
    <Card className="light-mode-card">
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
          <BarChart3 className="mr-2 h-5 w-5" />
          <h3 className="text-xl font-bold light-mode-text">Card Statistics</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dark:bg-black/30 light:bg-gray-100 rounded-lg p-4"
          >
            <h4 className="text-lg font-medium mb-4 flex items-center light-mode-text">
              <PieChart className="h-5 w-5 mr-2 dark:text-purple-400 light:text-purple-600" />
              Card Type Distribution
            </h4>

            <div className="flex justify-center mb-4">
              <div className="relative w-40 h-40">
                {/* Pie chart visualization */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Credit cards slice */}
                  {creditCards > 0 && (
                    <motion.circle
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{
                        strokeDasharray: `${calculatePercentage(creditCards)} ${100 - calculatePercentage(creditCards)}`,
                        strokeDashoffset: "25",
                      }}
                      transition={{ duration: 1, delay: 0.2 }}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      className="origin-center -rotate-90"
                    />
                  )}

                  {/* Debit cards slice */}
                  {debitCards > 0 && (
                    <motion.circle
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{
                        strokeDasharray: `${calculatePercentage(debitCards)} ${100 - calculatePercentage(debitCards)}`,
                        strokeDashoffset: `${25 - calculatePercentage(creditCards)}`,
                      }}
                      transition={{ duration: 1, delay: 0.4 }}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      className="origin-center -rotate-90"
                    />
                  )}

                  {/* Other cards slice */}
                  {otherCards > 0 && (
                    <motion.circle
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{
                        strokeDasharray: `${calculatePercentage(otherCards)} ${100 - calculatePercentage(otherCards)}`,
                        strokeDashoffset: `${25 - calculatePercentage(creditCards) - calculatePercentage(debitCards)}`,
                      }}
                      transition={{ duration: 1, delay: 0.6 }}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="20"
                      className="origin-center -rotate-90"
                    />
                  )}

                  {/* Center text */}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-current light-mode-text text-lg font-bold"
                  >
                    {totalCards}
                  </text>
                  <text
                    x="50"
                    y="60"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-current light-mode-text text-xs"
                  >
                    Total
                  </text>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-sm light-mode-text">Credit</span>
                </div>
                <div className="font-bold light-mode-text">{creditCards}</div>
                <div className="text-xs dark:text-gray-400 light:text-gray-500">
                  {calculatePercentage(creditCards)}%
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-sm light-mode-text">Debit</span>
                </div>
                <div className="font-bold light-mode-text">{debitCards}</div>
                <div className="text-xs dark:text-gray-400 light:text-gray-500">{calculatePercentage(debitCards)}%</div>
              </div>

              <div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                  <span className="text-sm light-mode-text">Other</span>
                </div>
                <div className="font-bold light-mode-text">{otherCards}</div>
                <div className="text-xs dark:text-gray-400 light:text-gray-500">{calculatePercentage(otherCards)}%</div>
              </div>
            </div>
          </motion.div>

          {/* Bank Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dark:bg-black/30 light:bg-gray-100 rounded-lg p-4"
          >
            <h4 className="text-lg font-medium mb-4 flex items-center light-mode-text">
              <CreditCard className="h-5 w-5 mr-2 dark:text-blue-400 light:text-blue-600" />
              Bank Distribution
            </h4>

            <div className="space-y-3">
              {Object.entries(bankDistribution).map(([bank, count], index) => (
                <div key={bank} className="space-y-1">
                  <div className="flex justify-between text-sm light-mode-text">
                    <span>{bank}</span>
                    <span>{count} cards</span>
                  </div>
                  <div className="w-full dark:bg-gray-700 light:bg-gray-300 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalCards) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Expiring Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="dark:bg-black/30 light:bg-gray-100 rounded-lg p-4 md:col-span-2"
          >
            <h4 className="text-lg font-medium mb-4 flex items-center light-mode-text">
              <Calendar className="h-5 w-5 mr-2 dark:text-yellow-400 light:text-yellow-600" />
              Expiring Cards
            </h4>

            {expiringCards.length > 0 ? (
              <div className="space-y-3">
                {expiringCards.map((card, index) => {
                  const expiryMonth = Number.parseInt(card.expiryDate.substring(0, 2))
                  const expiryYear = Number.parseInt(card.expiryDate.substring(2, 4))
                  const monthsDiff = (expiryYear - currentYear) * 12 + (expiryMonth - currentMonth)

                  let statusColor = "dark:text-green-400 light:text-green-600"
                  if (monthsDiff <= 1) statusColor = "dark:text-red-400 light:text-red-600"
                  else if (monthsDiff <= 2) statusColor = "dark:text-yellow-400 light:text-yellow-600"

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between dark:bg-black/20 light:bg-white p-3 rounded-lg"
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-3 dark:text-blue-400 light:text-blue-600" />
                        <div>
                          <div className="font-medium light-mode-text">{card.cardName}</div>
                          <div className="text-sm dark:text-white/70 light:text-gray-600">
                            **** {card.cardNumber.slice(-4)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${statusColor} flex items-center`}>
                          {monthsDiff <= 1 && <AlertTriangle className="h-4 w-4 mr-1" />}
                          Expires {expiryMonth}/{expiryYear}
                        </div>
                        <div className="text-sm dark:text-white/70 light:text-gray-600">
                          {monthsDiff === 0
                            ? "This month"
                            : monthsDiff === 1
                              ? "Next month"
                              : `In ${monthsDiff} months`}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 dark:text-gray-400 light:text-gray-500">
                <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No cards expiring in the next 3 months</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Card>
  )
}
