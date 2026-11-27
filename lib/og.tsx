import { ImageResponse } from "next/og"

/**
 * Image de partage (Open Graph / Twitter) générée à la volée.
 *
 * Rendu côté serveur en 1200×630 (le format attendu par les réseaux et par
 * `twitter:card = summary_large_image`). Pas d'asset binaire à maintenir, pas
 * de police externe à télécharger : la carte reste aux couleurs de la marque
 * (orange #ff7a1a sur fond sombre) et sert de visuel par défaut à toutes les
 * pages qui n'en définissent pas un propre.
 */
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"
export const ogAlt =
  "Jean Prudent IDOHOU — Développeur Web, SEO & Automatisation au Bénin"

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f0f0f",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Barre d'accent de marque */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: "#ff7a1a",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#ff7a1a",
            fontWeight: 700,
          }}
        >
          Développeur Web · SEO · Automatisation
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.02,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Jean Prudent IDOHOU
          </div>
          <div style={{ fontSize: 40, color: "#feae84", fontWeight: 500 }}>
            Sites web performants &amp; référencement local au Bénin
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            color: "#9e9e9e",
            fontWeight: 500,
          }}
        >
          jeanprudent — Cotonou, Bénin
        </div>
      </div>
    ),
    { ...ogSize },
  )
}
