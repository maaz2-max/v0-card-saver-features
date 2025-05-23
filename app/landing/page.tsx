"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import {
  CreditCard,
  Shield,
  Lock,
  Zap,
  ChevronRight,
  Sun,
  Moon,
  Github,
  ArrowRight,
  Database,
  Fingerprint,
  Eye,
  Key,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Secure Card Storage",
      description: "Store all your credit, debit, and other cards securely with advanced encryption.",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "PIN Protection",
      description: "Access your card details with a secure PIN that only you know.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Encryption",
      description: "All your sensitive card information is encrypted before being stored.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Cloud Backup",
      description: "Your encrypted data is securely backed up to the cloud for easy access.",
    },
    {
      icon: <Fingerprint className="h-6 w-6" />,
      title: "Card Categories",
      description: "Organize your cards by type, bank, or custom categories for easy management.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Expiry Tracking",
      description: "Get notified when your cards are about to expire so you never miss a renewal.",
    },
  ]

  const securityFeatures = [
    {
      icon: <Key className="h-5 w-5" />,
      title: "End-to-End Encryption",
      description: "Your data is encrypted on your device before being stored in the cloud.",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Time-Limited Visibility",
      description: "Sensitive details are automatically hidden after a short period of inactivity.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Authentication",
      description: "Multi-layer authentication ensures only you can access your cards.",
    },
  ]

  // If not mounted yet, don't render anything dependent on theme
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-red-100 dark:from-purple-900 dark:via-blue-800 dark:to-red-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Card Saver Logo" className="h-10 mr-2" />
          <h1 className="text-2xl font-bold light-mode-text">Card Saver</h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="light-mode-button"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/auth/sign-in")}
              className="light-mode-button"
            >
              Sign In
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block"
          >
            <Button
              onClick={() => router.push("/auth/sign-up")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 btn-3d"
            >
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 light-mode-text">
                Secure Your Cards <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Protect Your Data
                </span>
              </h1>
              <p className="text-xl mb-8 light-mode-text">
                Store and manage all your payment cards securely with advanced encryption and easy access.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d"
                >
                  <Button
                    onClick={() => router.push("/auth/sign-up")}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 animate-pulse-shadow"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const featuresSection = document.getElementById("features")
                      featuresSection?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="light-mode-button"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <div className="md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {/* Card Stack */}
              <div className="relative w-full max-w-md mx-auto h-80">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute top-0 left-0 w-full rounded-xl overflow-hidden shadow-2xl ${
                      i === 0
                        ? "bg-gradient-to-br from-purple-600 to-blue-600"
                        : i === 1
                          ? "bg-gradient-to-br from-red-600 to-purple-600"
                          : "bg-gradient-to-br from-blue-600 to-teal-600"
                    }`}
                    initial={{ rotate: (i - 1) * 5, y: i * 10, x: (i - 1) * 10 }}
                    animate={{
                      rotate: (i - 1) * 5,
                      y: [i * 10, i * 10 - 5, i * 10],
                      x: [(i - 1) * 10, (i - 1) * 10 + 2, (i - 1) * 10],
                    }}
                    transition={{
                      y: {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                        delay: i * 0.2,
                        repeatType: "reverse",
                      },
                      x: {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        delay: i * 0.3,
                        repeatType: "reverse",
                      },
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="p-6 h-64">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white/70 text-xs uppercase mb-1">Bank</div>
                          <div className="text-white font-medium">
                            {i === 0 ? "Premium Bank" : i === 1 ? "Global Credit" : "Secure Finance"}
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="text-lg font-mono tracking-wider text-white">
                          •••• •••• •••• {i === 0 ? "4242" : i === 1 ? "5678" : "9012"}
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <div>
                          <div className="text-white/60 text-xs uppercase">Card Holder</div>
                          <div className="text-white">
                            {i === 0 ? "John Smith" : i === 1 ? "Sarah Johnson" : "Alex Williams"}
                          </div>
                        </div>

                        <div>
                          <div className="text-white/60 text-xs uppercase">Valid Thru</div>
                          <div className="text-white font-mono">{i === 0 ? "05/26" : i === 1 ? "12/25" : "08/27"}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating security elements */}
              <motion.div
                className="absolute -top-10 -right-10 bg-purple-600 rounded-full p-3 shadow-lg"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatType: "reverse" }}
              >
                <Lock className="h-6 w-6 text-white" />
              </motion.div>
              <motion.div
                className="absolute -bottom-5 -left-5 bg-blue-600 rounded-full p-3 shadow-lg"
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, repeatType: "reverse" }}
              >
                <Shield className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 light-mode-text">
                Powerful <span className="text-purple-600">Features</span>
              </h2>
              <p className="text-xl max-w-2xl mx-auto light-mode-text">
                Card Saver provides everything you need to manage your cards securely and efficiently.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full light-mode-card border border-purple-500/20 hardware-accelerated">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 light-mode-text">{feature.title}</h3>
                  <p className="light-mode-text opacity-80">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 light-mode-text">
                  Bank-Grade <span className="text-purple-600">Security</span>
                </h2>
                <p className="text-xl mb-8 light-mode-text">
                  Your card information is protected with multiple layers of security to ensure your data stays safe.
                </p>

                <div className="space-y-6">
                  {securityFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-2 mr-4 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1 light-mode-text">{feature.title}</h3>
                        <p className="light-mode-text opacity-80">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatType: "reverse" }}
                  ></motion.div>
                  <motion.div
                    className="absolute inset-4 bg-gradient-to-r from-purple-600/40 to-blue-600/40 rounded-full"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 0.2, repeatType: "reverse" }}
                  ></motion.div>
                  <motion.div
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-600 rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: `rotate(${i * 45}deg) translateY(-120px)`,
                        }}
                      ></motion.div>
                    ))}
                  </motion.div>
                  <div className="absolute inset-8 md:inset-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 light-mode-text">
              Ready to <span className="text-purple-600">Secure Your Cards</span>?
            </h2>
            <p className="text-xl mb-8 light-mode-text">
              Join thousands of users who trust Card Saver to protect their sensitive card information.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d"
              >
                <Button
                  onClick={() => router.push("/auth/sign-up")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/auth/sign-in")}
                  className="light-mode-button"
                >
                  Sign In
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-t from-black/10 to-transparent dark:from-white/5 dark:to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <img src="/logo.png" alt="Card Saver Logo" className="h-10 mr-2" />
              <div>
                <h3 className="text-xl font-bold light-mode-text">Card Saver</h3>
                <p className="text-sm light-mode-text opacity-80">Developed by Mohammed Maaz A</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="https://chat.whatsapp.com/HlLyldgge3QBeI1bBax9WG"
                target="_blank"
                rel="noopener noreferrer"
                className="light-mode-text hover:text-purple-600 transition-colors"
              >
                Support & Feedback
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="light-mode-text hover:text-purple-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 dark:border-gray-800 light:border-gray-200 text-center">
            <p className="text-sm light-mode-text opacity-80">
              © {new Date().getFullYear()} Card Saver. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
