import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Supabase v2 stocke la session dans localStorage (côté navigateur), pas dans
// un cookie — le proxy serveur ne peut donc PAS lire l'état d'authentification
// ici. La vraie barrière de sécurité de l'admin est donc :
//   1. le garde client dans app/admin/layout.tsx (redirige vers /login)
//   2. surtout, les politiques RLS Supabase (migration 002) qui empêchent
//      toute lecture/écriture non autorisée, même si les pages sont servies.
// Ce proxy reste en place pour d'éventuels en-têtes/redirections futurs.
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
