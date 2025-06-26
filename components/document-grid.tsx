"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, FileText, Search, Shield, Calendar, Building, User, Trash2 } from "lucide-react"
import type { DocumentData } from "@/types/document"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DocumentGridProps {
  documents: DocumentData[]
  onDocumentSelect: (document: DocumentData) => void
  onAddDocument: () => void
  deleteMode: boolean
  onDeleteDocument: (index: number) => void
}

export default function DocumentGrid({
  documents,
  onDocumentSelect,
  onAddDocument,
  deleteMode,
  onDeleteDocument,
}: DocumentGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const documentTypes = [
    { value: "all", label: "All Types" },
    { value: "aadhaar", label: "Aadhaar Card" },
    { value: "pan", label: "PAN Card" },
    { value: "passport", label: "Passport" },
    { value: "license", label: "Driving License" },
    { value: "voter", label: "Voter ID" },
    { value: "other", label: "Other" },
  ]

  // Memoize filtered documents for better performance
  const filteredDocuments = useMemo(() => {
    let filtered = documents

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.documentType === typeFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.holderName && doc.holderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (doc.issuingAuthority && doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    return filtered
  }, [documents, searchTerm, typeFilter])

  const getDocumentIcon = (type: DocumentData["documentType"]) => {
    switch (type) {
      case "aadhaar":
        return "🆔"
      case "pan":
        return "💳"
      case "passport":
        return "📘"
      case "license":
        return "🚗"
      case "voter":
        return "🗳️"
      default:
        return "📄"
    }
  }

  const getDocumentTypeLabel = (type: DocumentData["documentType"]) => {
    return documentTypes.find((t) => t.value === type)?.label || "Other"
  }

  return (
    <div className="mobile-optimized">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search documents by name, number, or holder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-500 w-full"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-black/20 border-white/10 text-white">
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
        </motion.div>
      </div>

      {filteredDocuments.length === 0 && (searchTerm !== "" || typeFilter !== "all") ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 bg-black/20 rounded-lg"
        >
          <FileText className="h-12 w-12 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-300">No documents found matching your criteria</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("")
              setTypeFilter("all")
            }}
            className="text-purple-400 mt-2"
          >
            Clear filters
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredDocuments.map((document, index) => (
            <motion.div
              key={`${document.documentName}-${index}`}
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
              onClick={() => (deleteMode ? onDeleteDocument(index) : onDocumentSelect(document))}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 p-4 h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-2xl">{getDocumentIcon(document.documentType)}</div>
                  <div className="flex items-center gap-2">
                    {document.hasPin && <Shield className="h-4 w-4 text-purple-400" />}
                    {deleteMode && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteDocument(index)
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white font-medium text-sm truncate">{document.documentName}</h3>
                  <p className="text-gray-400 text-xs">{getDocumentTypeLabel(document.documentType)}</p>

                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-300">
                      <FileText className="h-3 w-3 mr-1" />
                      <span className="truncate">****{document.documentNumber.slice(-4)}</span>
                    </div>

                    {document.holderName && (
                      <div className="flex items-center text-xs text-gray-300">
                        <User className="h-3 w-3 mr-1" />
                        <span className="truncate">{document.holderName}</span>
                      </div>
                    )}

                    {document.expiryDate && (
                      <div className="flex items-center text-xs text-gray-300">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Expires: {new Date(document.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {document.issuingAuthority && (
                      <div className="flex items-center text-xs text-gray-300">
                        <Building className="h-3 w-3 mr-1" />
                        <span className="truncate">{document.issuingAuthority}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.95, rotateY: 5 }}
            className="flex justify-center items-center hardware-accelerated"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Button
              onClick={onAddDocument}
              className="h-full min-h-[180px] w-full bg-gradient-to-br from-black/30 to-black/10 hover:from-black/40 hover:to-black/20 backdrop-blur-sm border-2 border-dashed border-purple-400/30 rounded-xl text-white transform transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <Plus className="h-6 w-6 mb-2" />
                <span>Add New Document</span>
              </div>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
