"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { DocumentData } from "@/types/document"
import { FileText, X, Save, User, Calendar, Building, Loader2, Shield } from "lucide-react"

interface DocumentFormProps {
  onSave: (document: DocumentData) => void
  onCancel: () => void
  isSaving?: boolean
}

export default function DocumentForm({ onSave, onCancel, isSaving = false }: DocumentFormProps) {
  const [documentName, setDocumentName] = useState("")
  const [documentType, setDocumentType] = useState<DocumentData["documentType"]>("aadhaar")
  const [documentNumber, setDocumentNumber] = useState("")
  const [holderName, setHolderName] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [issuingAuthority, setIssuingAuthority] = useState("")
  const [hasPin, setHasPin] = useState(false)
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const documentTypes = [
    { value: "aadhaar", label: "Aadhaar Card" },
    { value: "pan", label: "PAN Card" },
    { value: "passport", label: "Passport" },
    { value: "license", label: "Driving License" },
    { value: "voter", label: "Voter ID" },
    { value: "other", label: "Other" },
  ]

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!documentName.trim()) {
      newErrors.documentName = "Document name is required"
    }

    if (!documentNumber.trim()) {
      newErrors.documentNumber = "Document number is required"
    }

    if (hasPin) {
      if (pin.length !== 4) {
        newErrors.pin = "PIN must be 4 digits"
      }
      if (pin !== confirmPin) {
        newErrors.confirmPin = "PINs do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm() && !isSaving) {
      const document: DocumentData = {
        documentName,
        documentType,
        documentNumber,
        holderName: holderName || undefined,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        issuingAuthority: issuingAuthority || undefined,
        hasPin,
        pin: hasPin ? pin : undefined,
        additionalInfo: additionalInfo || undefined,
      }

      onSave(document)
    }
  }

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-0 p-4 sm:p-6 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <FileText className="mr-2 h-5 w-5" /> Add New Document
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-400 hover:text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="documentName" className="text-white flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Document Name
          </Label>
          <Input
            id="documentName"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="e.g. My Aadhaar Card"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            disabled={isSaving}
          />
          {errors.documentName && <p className="text-red-400 text-sm">{errors.documentName}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-white">Document Type</Label>
          <Select
            value={documentType}
            onValueChange={(value) => setDocumentType(value as DocumentData["documentType"])}
            disabled={isSaving}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentNumber" className="text-white">
            Document Number
          </Label>
          <Input
            id="documentNumber"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            placeholder="Enter document number"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            disabled={isSaving}
          />
          {errors.documentNumber && <p className="text-red-400 text-sm">{errors.documentNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="holderName" className="text-white flex items-center">
            <User className="h-4 w-4 mr-2" /> Holder Name (Optional)
          </Label>
          <Input
            id="holderName"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="Name on document"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            disabled={isSaving}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="issueDate" className="text-white flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> Issue Date (Optional)
            </Label>
            <Input
              id="issueDate"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="text-white flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> Expiry Date (Optional)
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuingAuthority" className="text-white flex items-center">
            <Building className="h-4 w-4 mr-2" /> Issuing Authority (Optional)
          </Label>
          <Input
            id="issuingAuthority"
            value={issuingAuthority}
            onChange={(e) => setIssuingAuthority(e.target.value)}
            placeholder="e.g. Government of India"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            disabled={isSaving}
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasPin"
              checked={hasPin}
              onCheckedChange={(checked) => setHasPin(checked as boolean)}
              disabled={isSaving}
            />
            <Label htmlFor="hasPin" className="text-white flex items-center">
              <Shield className="h-4 w-4 mr-2" /> Set PIN protection for this document
            </Label>
          </div>

          {hasPin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-white">
                  4-Digit PIN
                </Label>
                <Input
                  id="pin"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="1234"
                  type="password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                  disabled={isSaving}
                />
                {errors.pin && <p className="text-red-400 text-sm">{errors.pin}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-white">
                  Confirm PIN
                </Label>
                <Input
                  id="confirmPin"
                  value={confirmPin}
                  onChange={handleConfirmPinChange}
                  placeholder="1234"
                  type="password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                  disabled={isSaving}
                />
                {errors.confirmPin && <p className="text-red-400 text-sm">{errors.confirmPin}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo" className="text-white">
            Additional Information (Optional)
          </Label>
          <Textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Any additional notes or information"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            disabled={isSaving}
            rows={3}
          />
        </div>

        <div className="flex justify-end pt-4">
          <motion.div whileHover={{ scale: isSaving ? 1 : 1.05 }} whileTap={{ scale: isSaving ? 1 : 0.95 }}>
            <Button
              type="submit"
              className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 hover:from-red-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Document
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </form>
    </Card>
  )
}
