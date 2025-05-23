type CardColorScheme = {
  background: string
  textColor: string
}

const colorSchemes: Record<string, CardColorScheme> = {
  visa: {
    background: "bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800",
    textColor: "text-white",
  },
  mastercard: {
    background: "bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500",
    textColor: "text-white",
  },
  amex: {
    background: "bg-gradient-to-br from-teal-600 via-teal-500 to-green-500",
    textColor: "text-white",
  },
  discover: {
    background: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500",
    textColor: "text-white",
  },
  "Bank of America": {
    background: "bg-gradient-to-br from-red-700 via-red-600 to-red-800",
    textColor: "text-white",
  },
  Chase: {
    background: "bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900",
    textColor: "text-white",
  },
  "Wells Fargo": {
    background: "bg-gradient-to-br from-red-800 via-red-700 to-yellow-700",
    textColor: "text-white",
  },
  Citibank: {
    background: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600",
    textColor: "text-white",
  },
  "Capital One": {
    background: "bg-gradient-to-br from-red-600 via-red-500 to-blue-600",
    textColor: "text-white",
  },
  HSBC: {
    background: "bg-gradient-to-br from-red-700 via-red-600 to-red-800",
    textColor: "text-white",
  },
  Barclays: {
    background: "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950",
    textColor: "text-white",
  },
  default: {
    background: "bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-700",
    textColor: "text-white",
  },
}

export function generateCardBackground(type: string): string {
  // Check if we have a specific color scheme for this bank/card type
  if (type && colorSchemes[type]) {
    return colorSchemes[type].background
  }

  // If not found, generate a random gradient from our color palette
  const colors = [
    "from-red-600 via-purple-600 to-blue-600",
    "from-blue-600 via-purple-600 to-red-600",
    "from-purple-600 via-pink-600 to-red-600",
    "from-indigo-600 via-purple-600 to-pink-600",
    "from-blue-600 via-indigo-600 to-purple-600",
    "from-red-600 via-orange-600 to-yellow-600",
    "from-purple-600 via-violet-600 to-indigo-600",
  ]

  // Use the first character of the type string to deterministically select a color
  // This ensures the same card type always gets the same color
  const index = type.charCodeAt(0) % colors.length
  return `bg-gradient-to-br ${colors[index]}`
}
