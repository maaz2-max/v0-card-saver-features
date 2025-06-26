export interface CardData {
  cardName: string
  bankName?: string
  cardHolderName?: string
  cardNumber: string
  expiryDate: string
  cvv: string
  pin: string
  atmPin?: string
  cardType: "credit" | "debit" | "prepaid" | "gift" | "other"
  issuer: "visa" | "mastercard" | "rupay" | "discover" | "amex" | "diners" | "jcb" | "other"
}
