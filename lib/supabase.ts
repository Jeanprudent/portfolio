import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// .trim() strips BOM (﻿) and invisible chars that break HTTP headers
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co").trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder").trim()

// createBrowserClient (et non createClient) : la session est écrite dans un
// cookie au lieu du localStorage, ce qui permet à proxy.ts de la lire côté
// serveur et de bloquer /gestion avant même de servir la page.
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

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
