import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV !== "production"

// Sources externes légitimes utilisées par l'app.
const SUPABASE = "https://*.supabase.co"
const ICONIFY = "https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com"
const TRANSLATE = "https://api.mymemory.translated.net"
// Google Analytics : le tag est chargé depuis googletagmanager, mais les mesures
// partent vers d'autres domaines — il faut les autoriser tous, sinon la CSP
// bloque le suivi sans le moindre signe visible.
// `analytics.google.com` est listé sans sous-domaine ET avec joker : GA4 utilise
// l'un ou l'autre selon la région du visiteur.
const GA_SCRIPT = "https://www.googletagmanager.com"
const GA_CONNECT = [
  "https://www.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://*.analytics.google.com",
].join(" ")

// Volontairement absents : `https://stats.g.doubleclick.net` et
// `https://www.google.com`, sollicités uniquement quand Google Signals
// (personnalisation publicitaire) est activé sur la propriété GA. La mesure
// d'audience fonctionne sans eux. Deux options si la console les signale :
// désactiver Google Signals dans GA (Administration → Collecte de données),
// ou les ajouter à GA_CONNECT ci-dessus.

// Content-Security-Policy. 'unsafe-inline' reste nécessaire pour les styles
// inline (style={{…}}) et l'hydratation de Next ; en dev, 'unsafe-eval' est
// requis par le bundler. La sanitisation DOMPurify reste la défense primaire
// contre le XSS — la CSP est une seconde barrière (defense in depth).
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${GA_SCRIPT}${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' ${SUPABASE} ${ICONIFY} ${TRANSLATE} ${GA_CONNECT}${isDev ? " ws:" : ""}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Bannières de services / images d'articles téléversées depuis le back-office.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
