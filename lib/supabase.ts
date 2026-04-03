import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with elevated permissions
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export type Database = {
  public: {
    Tables: {
      news_radar: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string | null
          image_url: string | null
          source_name: string | null
          source_link: string
          category: string | null
          published_at: string | null
          created_at: string
          tags: string[] | null
          views: number
          is_featured: boolean
          is_breaking: boolean
          language: string
        }
        Insert: {
          id?: string
          title: string
          summary?: string | null
          content?: string | null
          image_url?: string | null
          source_name?: string | null
          source_link: string
          category?: string | null
          published_at?: string | null
          created_at?: string
          tags?: string[] | null
          views?: number
          is_featured?: boolean
          is_breaking?: boolean
          language?: string
        }
        Update: {
          title?: string
          summary?: string | null
          content?: string | null
          image_url?: string | null
          source_name?: string | null
          category?: string | null
          published_at?: string | null
          tags?: string[] | null
          views?: number
          is_featured?: boolean
          is_breaking?: boolean
        }
      }
    }
  }
}
