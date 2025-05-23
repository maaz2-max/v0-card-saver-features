"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Save, ShieldCheck, Database } from "lucide-react"

export default function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.6, 1],
          }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-full mb-4 relative"
        >
          <CheckCircle2 className="h-16 w-16 text-white" />

          {/* Animated particles */}
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: [0, 1, 0],
                  scale: [1, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: 1,
                  repeatType: "reverse",
                }}
                style={{
                  top: `${50 + Math.random() * 10 - 5}%`,
                  left: `${50 + Math.random() * 10 - 5}%`,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.3 },
          }}
          className="flex items-center bg-black/80 px-6 py-4 rounded-xl"
        >
          <img src="/logo.png" alt="Card Saver Logo" className="h-10 mr-3" />
          <div>
            <p className="text-white font-medium">Card Saved Successfully</p>
            <p className="text-gray-300 text-sm">Your card has been encrypted and stored securely</p>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              transition: {
                delay: 0.8,
                duration: 1.5,
                repeat: 1,
                repeatType: "reverse",
              },
            }}
            className="flex items-center text-white mb-2"
          >
            <Save className="h-5 w-5 mr-2 animate-pulse" />
            <span>Encrypting data...</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: 1,
              width: "100%",
              transition: { delay: 1, duration: 1 },
            }}
            className="h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1],
              transition: {
                delay: 1.5,
                duration: 0.5,
              },
            }}
            className="flex items-center text-green-400 mt-2"
          >
            <Database className="h-5 w-5 mr-2" />
            <span>Saved to cloud database</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1],
              transition: {
                delay: 2,
                duration: 0.5,
              },
            }}
            className="flex items-center text-purple-400 mt-2"
          >
            <ShieldCheck className="h-5 w-5 mr-2" />
            <span>Secured with encryption</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
