import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// .trim() strips BOM (﻿) and invisible chars that break HTTP headers
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co").trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder").trim()

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
