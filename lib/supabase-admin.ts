import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Client Supabase « service_role » — usage exclusivement serveur.
 *
 * Toutes les autres lectures du site passent par la clé anon (lib/supabase.ts
 * et lib/supabase-data.ts), soumise au RLS de la migration 002 : l'écriture
 * dans `blog_posts` y est réservée à `is_admin()`, c'est-à-dire à une session
 * dont l'email figure dans `admin_emails`. Un webhook appelé par n8n n'a pas
 * de session : il ne peut donc rien écrire avec la clé anon.
 *
 * La clé service_role contourne le RLS. C'est voulu ici, et c'est la raison
 * pour laquelle ce module doit rester confiné aux route handlers :
 *
 *  - la variable ne porte PAS le préfixe NEXT_PUBLIC_, donc Next ne l'inline
 *    jamais dans un bundle navigateur ;
 *  - importer ce fichier depuis un composant client ferait fuiter la clé, qui
 *    donne un accès total en lecture ET en écriture à toute la base.
 *
 * Ne l'importe que depuis app/api/**.
 */
export function supabaseAdmin(): SupabaseClient | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()

  // Configuration incomplète : on renvoie null plutôt que de construire un
  // client qui échouera sur chaque requête avec une erreur illisible.
  if (!url || !key) return null

  return createClient(url, key, {
    // Aucune session à conserver ni à rafraîchir : chaque invocation du route
    // handler est isolée, et le stockage par défaut n'existe pas côté serveur.
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
