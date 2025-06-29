import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Enhanced validation with better error messages
const validateEnvironmentVariables = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    throw new Error(
      `Missing Supabase environment variables: ${missingVars.join(', ')}. ` +
      `Please check your .env.local file and ensure these variables are set with your actual Supabase project credentials.`
    )
  }

  // Check for placeholder values
  if (supabaseUrl.includes('your-project-id') || supabaseUrl === 'https://your-project-id.supabase.co') {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL contains placeholder value. ' +
      'Please replace it with your actual Supabase project URL from your Supabase dashboard.'
    )
  }

  if (supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey === 'your-anon-key-here') {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value. ' +
      'Please replace it with your actual anon key from your Supabase dashboard.'
    )
  }

  // Validate URL format
  try {
    const url = new URL(supabaseUrl)
    if (!url.hostname.endsWith('.supabase.co')) {
      throw new Error('Invalid Supabase URL format. It should end with .supabase.co')
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Invalid NEXT_PUBLIC_SUPABASE_URL format: "${supabaseUrl}". ` +
        'Please check your environment variables and ensure the URL is valid.'
      )
    }
    throw error
  }
}

// Create a single supabase client for the browser
const createBrowserClient = () => {
  validateEnvironmentVariables()

  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
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
    try {
      browserClient = createBrowserClient()
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      throw error
    }
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