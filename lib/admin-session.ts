/**
 * Durée de vie d'une session du back-office.
 *
 * @supabase/ssr écrit ses cookies d'authentification avec un max-age de
 * 400 jours et réimpose cette valeur même si on passe `cookieOptions.maxAge`
 * (voir `setCookieOptions` dans @supabase/ssr/dist/main/cookies.js). La durée
 * de session ne peut donc pas venir de la librairie : elle est portée par un
 * cookie séparé, celui-ci.
 *
 *   - Aucun `Max-Age` : le navigateur l'efface à sa fermeture.
 *   - Sa valeur est l'horodatage de la dernière activité, d'où l'expiration
 *     après 30 minutes d'inactivité.
 *
 * proxy.ts fait foi : sans ce cookie, les cookies Supabase sont effacés et
 * l'écran de connexion reprend la main avant que le back-office ne soit servi.
 * Le garde client (app/gestion/layout.tsx) ne fait que déconnecter plus tôt
 * un onglet resté ouvert.
 */
export const ACTIVITY_COOKIE = "jp_admin_seen"

export const INACTIVITY_MS = 30 * 60 * 1000

/** Canal de synchronisation des déconnexions entre onglets. */
export const AUTH_CHANNEL = "jp-admin-auth"
export const SIGNED_OUT = "signed-out"

/** Une valeur absente, illisible ou trop ancienne vaut session expirée. */
export function isSessionExpired(value?: string | null): boolean {
  const horodatage = Number(value)
  if (!value || !Number.isFinite(horodatage)) return true
  return Date.now() - horodatage > INACTIVITY_MS
}

export function readActivity(): string | null {
  if (typeof document === "undefined") return null
  const found = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${ACTIVITY_COOKIE}=`))
  return found ? found.slice(ACTIVITY_COOKIE.length + 1) : null
}

/** Cookie de session — sans Max-Age, donc effacé à la fermeture du navigateur. */
export function touchActivity(): void {
  if (typeof document === "undefined") return
  const secure = location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${ACTIVITY_COOKIE}=${Date.now()}; Path=/; SameSite=Lax${secure}`
}

export function clearActivity(): void {
  if (typeof document === "undefined") return
  document.cookie = `${ACTIVITY_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}
