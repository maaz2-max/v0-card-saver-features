import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

// Create a single supabase client for the browser
const createBrowserClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Please check your .env.local file.")
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL format. Please check your environment variables.")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Create a singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseBrowserClient should only be called on the client side')
  }
  
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Create a server client (for server components and server actions)
export function createServerClient() {
  const serverUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!serverUrl || !serverKey) {
    throw new Error("Missing server-side Supabase environment variables")
  }

  return createClient<Database>(serverUrl, serverKey, {
    auth: {
      persistSession: false,
    },
  })
}