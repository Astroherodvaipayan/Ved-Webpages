import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both env vars are set AND URL is valid
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http')

export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
