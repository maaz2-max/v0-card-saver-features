export interface DocumentData {
  id?: string
  documentName: string
  documentType: "aadhaar" | "pan" | "passport" | "license" | "voter" | "other"
  documentNumber: string
  holderName?: string
  issueDate?: string
  expiryDate?: string
  issuingAuthority?: string
  hasPin: boolean
  pin?: string
  additionalInfo?: string
}
