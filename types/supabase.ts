export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string
          created_at: string
          user_id: string
          card_data: Json
          card_name: string
          bank_name: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          card_data: Json
          card_name: string
          bank_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          card_data?: Json
          card_name?: string
          bank_name?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          display_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
