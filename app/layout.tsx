import type { Metadata } from "next"
import Script from "next/script"
import { Syne, DM_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { I18nProvider } from "@/components/providers/I18nProvider"
import "./globals.css"

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

export const metadata: Metadata = {
  metadataBase: new URL("https://jeanprudent.dev"),
  title: {
    default: "Jean Prudent — Développeur Web & Designer | Cotonou, Bénin",
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
    "Cotonou",
    "création site web",
  ],
  authors: [{ name: "Jean Prudent IDOHOU" }],
  creator: "Jean Prudent IDOHOU",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Jean Prudent — Développeur Web & Designer",
    description:
      "Sites web performants, élégants et optimisés pour le SEO. Spécialisé PME/TPE.",
    siteName: "Jean Prudent Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jean Prudent — Développeur Web & Designer",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${syne.variable} ${dmSans.variable}`}>
      <head>
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
