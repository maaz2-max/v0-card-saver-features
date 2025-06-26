import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { DocumentData } from "@/types/document"
import { encryptData, decryptData } from "@/lib/security"

export async function saveDocument(document: DocumentData) {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Encrypt sensitive document data
  const encryptedDocumentData = encryptData(
    JSON.stringify({
      documentNumber: document.documentNumber,
      pin: document.pin,
      additionalInfo: document.additionalInfo,
    }),
  )

  // Store in Supabase with explicit user_id
  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      document_name: document.documentName,
      document_type: document.documentType,
      holder_name: document.holderName || null,
      issue_date: document.issueDate || null,
      expiry_date: document.expiryDate || null,
      issuing_authority: document.issuingAuthority || null,
      has_pin: document.hasPin,
      document_data: {
        encrypted: encryptedDocumentData,
      },
    })
    .select()

  if (error) {
    console.error("Error saving document:", error)
    throw new Error(error.message)
  }

  return data[0]
}

export async function getDocuments() {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    throw new Error(error.message)
  }

  // Transform database records to DocumentData objects
  return data
    .map((record) => {
      try {
        const encryptedData = record.document_data.encrypted
        const decryptedData = JSON.parse(decryptData(encryptedData))

        return {
          id: record.id,
          documentName: record.document_name,
          documentType: record.document_type,
          holderName: record.holder_name,
          issueDate: record.issue_date,
          expiryDate: record.expiry_date,
          issuingAuthority: record.issuing_authority,
          hasPin: record.has_pin,
          documentNumber: decryptedData.documentNumber,
          pin: decryptedData.pin,
          additionalInfo: decryptedData.additionalInfo,
        } as DocumentData
      } catch (error) {
        console.error("Error decrypting document data:", error)
        return null
      }
    })
    .filter(Boolean) as DocumentData[]
}

export async function deleteDocument(id: string) {
  const supabase = getSupabaseBrowserClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("documents").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting document:", error)
    throw new Error(error.message)
  }

  return true
}
