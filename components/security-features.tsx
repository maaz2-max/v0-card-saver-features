"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Lock, Shield, Eye, EyeOff, Fingerprint, Database, Key, AlertTriangle, Smartphone, Clock } from "lucide-react"

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
      title: "Local Storage",
      description: "Your data never leaves your device and is stored locally",
      color: "from-green-600 to-teal-600",
    },
    {
      icon: <Key />,
      title: "Data Encryption",
      description: "All card data is encrypted before being stored",
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
      icon: <Smartphone />,
      title: "Device-Only Access",
      description: "Cards can only be accessed from the device they were saved on",
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
    <Card className="bg-black/20 backdrop-blur-sm border-0 text-white">
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
          <Shield className="mr-2 h-5 w-5" />
          <h3 className="text-xl font-bold">Security Features</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 rounded-lg overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
              <div className="p-4">
                <div className="flex items-start">
                  <div className={`bg-gradient-to-r ${feature.color} p-2 rounded-full mr-3`}>{feature.icon}</div>
                  <div>
                    <span className="font-medium text-lg">{feature.title}</span>
                    <p className="text-gray-300 text-sm mt-1">{feature.description}</p>
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
          className="mt-8 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4"
        >
          <h4 className="font-medium text-lg mb-2 flex items-center">
            <Shield className="mr-2 h-4 w-4 text-purple-400" />
            How Your Data Is Protected
          </h4>
          <p className="text-gray-300 text-sm">
            Card Saver uses advanced security techniques to protect your sensitive information:
          </p>
          <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
            <li>All data is encrypted before being stored in your browser's local storage</li>
            <li>Your data never leaves your device - no server communication</li>
            <li>PIN protection prevents unauthorized access to card details</li>
            <li>Sensitive information like CVV is only displayed temporarily</li>
            <li>Screen capture prevention blocks attempts to screenshot your card details</li>
            <li>Automatic session timeout for added security</li>
            <li>Forgot PIN protection allows secure deletion if PIN is forgotten</li>
            <li>Multiple failed PIN attempts trigger temporary lockout</li>
          </ul>
        </motion.div>
      </div>
    </Card>
  )
}
