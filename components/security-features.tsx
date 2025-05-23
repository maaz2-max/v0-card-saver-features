"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Lock, Shield, Eye, EyeOff, Fingerprint, Database, Key, AlertTriangle, Clock, Cloud } from "lucide-react"

export default function SecurityFeatures() {
  const features = [
    {
      icon: <Lock />,
      title: "PIN Protection",
      description: "All card details are protected by your 4-digit PIN",
      color: "from-purple-600 to-blue-600",
    },
    {
      icon: <Eye />,
      title: "Time-Limited CVV",
      description: "CVV is only visible for 1 minute before being hidden",
      color: "from-blue-600 to-cyan-600",
    },
    {
      icon: <EyeOff />,
      title: "Screen Capture Prevention",
      description: "Application prevents screenshots and screen recording",
      color: "from-red-600 to-orange-600",
    },
    {
      icon: <Database />,
      title: "Cloud Database Storage",
      description: "Your encrypted data is securely stored in a cloud database",
      color: "from-green-600 to-teal-600",
    },
    {
      icon: <Key />,
      title: "End-to-End Encryption",
      description: "All card data is encrypted before being stored in the database",
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: <Fingerprint />,
      title: "Lockout Protection",
      description: "Multiple failed PIN attempts will temporarily lock access",
      color: "from-indigo-600 to-purple-600",
    },
    {
      icon: <AlertTriangle />,
      title: "Forgot PIN Protection",
      description: "Option to delete card if PIN is forgotten for security",
      color: "from-red-600 to-yellow-600",
    },
    {
      icon: <Cloud />,
      title: "Secure Cloud Backup",
      description: "Your data is backed up securely in the cloud with encryption",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: <Clock />,
      title: "Auto Session Timeout",
      description: "Card details are automatically hidden after period of inactivity",
      color: "from-teal-600 to-green-600",
    },
  ]

  return (
    <Card className="light-mode-card">
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
          <Shield className="mr-2 h-5 w-5" />
          <h3 className="text-xl font-bold light-mode-text">Security Features</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="dark:bg-black/30 bg-gray-100 rounded-lg overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
              <div className="p-4">
                <div className="flex items-start">
                  <div className={`bg-gradient-to-r ${feature.color} p-2 rounded-full mr-3`}>{feature.icon}</div>
                  <div>
                    <span className="font-medium text-lg light-mode-text">{feature.title}</span>
                    <p className="dark:text-gray-300 text-gray-600 text-sm mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 dark:bg-purple-900/20 bg-purple-100 dark:border-purple-500/30 border-purple-300 rounded-lg p-4 border"
        >
          <h4 className="font-medium text-lg mb-2 flex items-center light-mode-text">
            <Shield className="mr-2 h-4 w-4 dark:text-purple-400 text-purple-600" />
            How Your Data Is Protected
          </h4>
          <p className="dark:text-gray-300 text-gray-600 text-sm">
            Card Saver uses advanced security techniques to protect your sensitive information:
          </p>
          <ul className="list-disc list-inside dark:text-gray-300 text-gray-600 text-sm mt-2 space-y-1">
            <li>All data is encrypted with industry-standard encryption before being stored in our secure database</li>
            <li>Your encrypted data is stored in a secure cloud database with multiple layers of protection</li>
            <li>PIN protection prevents unauthorized access to card details</li>
            <li>Sensitive information like CVV is only displayed temporarily</li>
            <li>Screen capture prevention blocks attempts to screenshot your card details</li>
            <li>Automatic session timeout for added security</li>
            <li>Forgot PIN protection allows secure deletion if PIN is forgotten</li>
            <li>Multiple failed PIN attempts trigger temporary lockout</li>
            <li>Regular security audits and updates to maintain the highest level of protection</li>
          </ul>
        </motion.div>
      </div>
    </Card>
  )
}
