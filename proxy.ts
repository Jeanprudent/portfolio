import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const LOGIN_PATH = "/gestion/login"

// La session Supabase est stockée dans un cookie (voir lib/supabase.ts), ce qui
// permet de la vérifier ici, AVANT de servir quoi que ce soit. Un visiteur non
// authentifié ne reçoit donc plus le HTML ni le JS du back-office.
//
// Ce garde s'ajoute aux deux autres couches, il ne les remplace pas :
//   1. le garde client dans app/gestion/layout.tsx
//   2. surtout, les politiques RLS Supabase (migration 002), seule barrière
//      qui protège réellement les données.
export async function proxy(request: NextRequest) {
  // Réponse mutable : c'est elle qui portera les cookies rafraîchis.
  const response = NextResponse.next({ request })

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()

  // Sans configuration Supabase, on ne peut pas authentifier : on laisse la
  // main au garde client plutôt que de verrouiller tout le back-office.
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
        // Une réponse qui pose des cookies d'auth ne doit jamais être mise en
        // cache par un CDN — sinon la session d'un visiteur fuite vers un autre.
        for (const [header, value] of Object.entries(headers)) {
          response.headers.set(header, value)
        }
      },
    },
  })

  // getUser() valide le jeton auprès de Supabase ; getSession() se contente de
  // lire le cookie, qui est falsifiable.
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH

  if (!user && !isLoginPage) {
    const redirect = request.nextUrl.clone()
    redirect.pathname = LOGIN_PATH
    return NextResponse.redirect(redirect)
  }

  // Déjà connecté : inutile de réafficher l'écran de connexion.
  if (user && isLoginPage) {
    const redirect = request.nextUrl.clone()
    redirect.pathname = "/gestion"
    return NextResponse.redirect(redirect)
  }

  return response
}

export const config = {
  matcher: ["/gestion/:path*"],
}
