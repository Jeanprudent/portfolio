import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import Script from "next/script"
import {
  Sofia_Sans,
  Sofia_Sans_Extra_Condensed,
  Syne,
  DM_Sans,
  Outfit,
  Inter,
  Space_Grotesk,
  Plus_Jakarta_Sans,
  Manrope,
} from "next/font/google"
import { fontPairStyle } from "@/lib/font-pairs"
import { getFontPair } from "@/lib/supabase-data"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { I18nProvider } from "@/components/providers/I18nProvider"
import "./globals.css"

// Polices de marque (charte « La une »). Variables → pas de poids à déclarer.
// Sofia Sans Extra Condensed : titres (display). Sofia Sans : texte courant.
const sofiaCondensed = Sofia_Sans_Extra_Condensed({
  variable: "--font-sofia-condensed",
  subsets: ["latin"],
  display: "swap",
})

const sofiaSans = Sofia_Sans({
  variable: "--font-sofia-sans",
  subsets: ["latin"],
  display: "swap",
})

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

// Paires alternatives proposées dans /gestion/design. `preload: false` est
// délibéré : les sept familles déclarent leur @font-face, mais le navigateur
// ne télécharge que les fichiers de la paire réellement référencée par
// --font-heading-family / --font-body-family.
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap", preload: false })
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: false })
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap", preload: false })
const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"], display: "swap", preload: false })
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap", preload: false })

const FONTS = [sofiaCondensed, sofiaSans, syne, dmSans, outfit, inter, spaceGrotesk, plusJakarta, manrope]
const FONT_VARIABLES = FONTS.map((f) => f.variable).join(" ")

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Développeur Web, SEO & Automatisation au Bénin | Jean Prudent IDOHOU",
    template: "%s | Jean Prudent",
  },
  description:
    "Je crée des sites web qui transforment votre présence en ligne en moteur de croissance. Développeur frontend & web designer spécialisé pour PME, TPE et entrepreneurs.",
  keywords: [
    "développeur web",
    "web designer",
    "freelance",
    "Next.js",
    "WordPress",
    "SEO",
    "Bénin",
    "Automatisation",
    "création site web",
  ],
  authors: [{ name: "Jean Prudent IDOHOU" }],
  creator: "Jean Prudent IDOHOU",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Développeur Web, Consultant SEO & Automatisation | Jean Prudent IDOHOU",
    description:
      "Sites web performants, élégants et optimisés pour le SEO. Spécialisé PME/TPE.",
    siteName: "Jean Prudent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Développeur Web & Designer web | Jean Prudent IDOHOU",
    description: "Sites web performants, élégants et optimisés pour le SEO.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "Iu0K2WlFlPQqblv9ihAcSuFZSaewz1QLj5rrZmUHW-8",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fontPair = await getFontPair()

  return (
    <html lang="fr" suppressHydrationWarning className={FONT_VARIABLES} style={fontPairStyle(fontPair)}>
      <head>
        {/* Thème avant le premier rendu (anti-FOUC). Script inline dans le
            <head> d'un composant serveur : c'est du HTML statique, donc il
            s'exécute avant la peinture ET ne déclenche pas l'avertissement
            React 19 sur les <script> rendus dans un composant client. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('jp_theme');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}",
          }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XLR3RZBL4D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-XLR3RZBL4D');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
