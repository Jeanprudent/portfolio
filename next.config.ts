import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV !== "production"

// Sources externes légitimes utilisées par l'app.
const SUPABASE = "https://*.supabase.co"
const ICONIFY = "https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com"
const TRANSLATE = "https://api.mymemory.translated.net"

// Content-Security-Policy. 'unsafe-inline' reste nécessaire pour les styles
// inline (style={{…}}) et l'hydratation de Next ; en dev, 'unsafe-eval' est
// requis par le bundler. La sanitisation DOMPurify reste la défense primaire
// contre le XSS — la CSP est une seconde barrière (defense in depth).
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' ${SUPABASE} ${ICONIFY} ${TRANSLATE}${isDev ? " ws:" : ""}`,
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
