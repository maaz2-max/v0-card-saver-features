import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { CardData } from "@/types/card"
import { encryptData, decryptData } from "@/lib/security"

export async function saveCard(card: CardData) {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Encrypt sensitive card data
  const encryptedCardData = encryptData(
    JSON.stringify({
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      cvv: card.cvv,
      pin: card.pin,
      atmPin: card.atmPin,
    }),
  )

  // Store in Supabase with explicit user_id
  const { data, error } = await supabase
    .from("cards")
    .insert({
      user_id: user.id,
      card_name: card.cardName,
      bank_name: card.bankName || null,
      card_data: {
        encrypted: encryptedCardData,
        cardHolderName: card.cardHolderName || card.cardName,
      },
    })
    .select()

  if (error) {
    console.error("Error saving card:", error)
    throw new Error(error.message)
  }

  return data[0]
}

export async function getCards() {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cards:", error)
    throw new Error(error.message)
  }

  // Transform database records to CardData objects
  return data
    .map((record) => {
      try {
        const encryptedData = record.card_data.encrypted
        const decryptedData = JSON.parse(decryptData(encryptedData))

        return {
          id: record.id,
          cardName: record.card_name,
          bankName: record.bank_name || undefined,
          cardHolderName: record.card_data.cardHolderName,
          cardNumber: decryptedData.cardNumber,
          expiryDate: decryptedData.expiryDate,
          cvv: decryptedData.cvv,
          pin: decryptedData.pin,
          atmPin: decryptedData.atmPin,
        } as CardData & { id: string }
      } catch (error) {
        console.error("Error decrypting card data:", error)
        return null
      }
    })
    .filter(Boolean) as (CardData & { id: string })[]
}

export async function deleteCard(id: string) {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("cards").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting card:", error)
    throw new Error(error.message)
  }

  return true
}

export async function getUserProfile() {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateUserProfile(displayName: string) {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id)
    .select()

  if (error) {
    console.error("Error updating user profile:", error)
    throw new Error(error.message)
  }

  return data[0]
}
