"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import type { CardData } from "@/types/card"
import { formatCardNumber, formatExpiryDate } from "@/lib/format"
import { CreditCard, X, Save, CreditCardIcon as CardIcon, Building, User, Calendar, KeyRound } from "lucide-react"
import { generateCardBackground } from "@/lib/colors"

interface CardFormProps {
  onSave: (card: CardData) => void
  onCancel: () => void
}

export default function CardForm({ onSave, onCancel }: CardFormProps) {
  const [cardName, setCardName] = useState("")
  const [bankName, setBankName] = useState("")
  const [cardHolderName, setCardHolderName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [atmPin, setAtmPin] = useState("")
  const [confirmAtmPin, setConfirmAtmPin] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("basic")
  const [includeCvv, setIncludeCvv] = useState(true)

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 16) {
      setCardNumber(value)
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setExpiryDate(value)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setCvv(value)
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setPin(value)
    }
  }

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setConfirmPin(value)
    }
  }

  const handleAtmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setAtmPin(value)
    }
  }

  const handleConfirmAtmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setConfirmAtmPin(value)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!cardName.trim()) {
      newErrors.cardName = "Card name is required"
    }

    if (!cardHolderName.trim()) {
      newErrors.cardHolderName = "Card holder name is required"
    }

    if (cardNumber.length < 13 || cardNumber.length > 16) {
      newErrors.cardNumber = "Card number must be between 13-16 digits"
    }

    if (expiryDate.length !== 4) {
      newErrors.expiryDate = "Expiry date must be in MMYY format"
    } else {
      const month = Number.parseInt(expiryDate.substring(0, 2))
      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Invalid month"
      }
    }

    if (includeCvv && (cvv.length < 3 || cvv.length > 4)) {
      newErrors.cvv = "CVV must be 3-4 digits"
    }

    if (pin.length !== 4) {
      newErrors.pin = "Security PIN must be 4 digits"
    }

    if (pin !== confirmPin) {
      newErrors.confirmPin = "Security PINs do not match"
    }

    if (atmPin.length !== 4) {
      newErrors.atmPin = "ATM PIN must be 4 digits"
    }

    if (atmPin !== confirmAtmPin) {
      newErrors.confirmAtmPin = "ATM PINs do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const card: CardData = {
        cardName,
        bankName,
        cardHolderName,
        cardNumber,
        expiryDate,
        cvv: includeCvv ? cvv : "",
        pin,
        atmPin,
      }

      onSave(card)
    }
  }

  const getCardBackground = () => {
    return generateCardBackground(bankName || "default")
  }

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-0 p-6 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <CreditCard className="mr-2 h-5 w-5" /> Add New Card
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-400 hover:text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6">
        <div className={`w-full h-48 rounded-xl ${getCardBackground()} p-5 shadow-lg transition-all duration-300`}>
          <div className="flex justify-between">
            <div>
              <div className="text-white/70 text-xs uppercase mb-1">Bank</div>
              <div className="text-white font-medium">{bankName || "Your Bank"}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <CardIcon className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-lg font-mono tracking-wider text-white">
              {cardNumber ? formatCardNumber(cardNumber) : "•••• •••• •••• ••••"}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <div className="text-white/60 text-xs uppercase">Card Holder</div>
              <div className="text-white">{cardHolderName || "Your Name"}</div>
            </div>

            <div>
              <div className="text-white/60 text-xs uppercase">Valid Thru</div>
              <div className="text-white font-mono">{expiryDate ? formatExpiryDate(expiryDate) : "MM/YY"}</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 gap-1">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-sm"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-sm"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-white flex items-center">
                <CardIcon className="h-4 w-4 mr-2" /> Card Name
              </Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g. My Debit Card"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
              {errors.cardName && <p className="text-red-400 text-sm">{errors.cardName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-white flex items-center">
                <Building className="h-4 w-4 mr-2" /> Bank Name
              </Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Chase, Bank of America"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolderName" className="text-white flex items-center">
                <User className="h-4 w-4 mr-2" /> Card Holder Name
              </Label>
              <Input
                id="cardHolderName"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="e.g. John Smith"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
              {errors.cardHolderName && <p className="text-red-400 text-sm">{errors.cardHolderName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-white flex items-center">
                <CardIcon className="h-4 w-4 mr-2" /> Card Number
              </Label>
              <Input
                id="cardNumber"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
              />
              {errors.cardNumber && <p className="text-red-400 text-sm">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-white flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  value={formatExpiryDate(expiryDate)}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                />
                {errors.expiryDate && <p className="text-red-400 text-sm">{errors.expiryDate}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cvv" className="text-white flex items-center">
                    <KeyRound className="h-4 w-4 mr-2" /> CVV
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCvv"
                      checked={includeCvv}
                      onCheckedChange={(checked) => setIncludeCvv(checked as boolean)}
                    />
                    <label htmlFor="includeCvv" className="text-xs text-gray-300">
                      Include CVV
                    </label>
                  </div>
                </div>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  type="password"
                  disabled={!includeCvv}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono disabled:opacity-50"
                />
                {errors.cvv && <p className="text-red-400 text-sm">{errors.cvv}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => setActiveTab("security")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Next: Security
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="pt-2 border-t border-white/10">
              <h4 className="text-white font-medium mb-4">Security PIN</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-white">
                    4-Digit Security PIN
                  </Label>
                  <Input
                    id="pin"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="1234"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                  />
                  {errors.pin && <p className="text-red-400 text-sm">{errors.pin}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPin" className="text-white">
                    Confirm Security PIN
                  </Label>
                  <Input
                    id="confirmPin"
                    value={confirmPin}
                    onChange={handleConfirmPinChange}
                    placeholder="1234"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                  />
                  {errors.confirmPin && <p className="text-red-400 text-sm">{errors.confirmPin}</p>}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <h4 className="text-white font-medium mb-4">ATM PIN</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="atmPin" className="text-white">
                    4-Digit ATM PIN
                  </Label>
                  <Input
                    id="atmPin"
                    value={atmPin}
                    onChange={handleAtmPinChange}
                    placeholder="1234"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                  />
                  {errors.atmPin && <p className="text-red-400 text-sm">{errors.atmPin}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmAtmPin" className="text-white">
                    Confirm ATM PIN
                  </Label>
                  <Input
                    id="confirmAtmPin"
                    value={confirmAtmPin}
                    onChange={handleConfirmAtmPinChange}
                    placeholder="1234"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                  />
                  {errors.confirmAtmPin && <p className="text-red-400 text-sm">{errors.confirmAtmPin}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                onClick={() => setActiveTab("basic")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 hover:from-red-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Card
                </Button>
              </motion.div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
